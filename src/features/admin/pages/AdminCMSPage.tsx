// @ts-nocheck
import { useLoaderData } from '@tanstack/react-router';
import { 
  Settings, Save, RefreshCw, Eye, Code, Layout, 
  Palette, Type as FontSizes, TextCursorInput, 
  CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateSiteSettingsData, getSiteSettingsData } from '@/shared/services/firestore';
import { cn } from '@/shared/lib/utils';

export const AdminCMSPage = () => {
  const { settings } = (useLoaderData({ strict: false }) as any);
  
  const [formData, setFormData] = useState({
    heroTitle: settings?.heroTitle || 'Find your perfect home',
    heroSubtitle: settings?.heroSubtitle || 'Verified properties for everyone',
    heroImage: settings?.heroImage || '',
    ctaText: settings?.ctaText || 'Browse Properties',
    featuredProperties: settings?.featuredProperties || [],
    theme: settings?.theme || {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, sans-serif',
      animationSpeed: '1s'
    },
    features: settings?.features || {
      enableBlog: false
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? e.target.checked : value 
    }));
  };

  const handleFeatureToggle = (feature: keyof typeof formData.features, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setShowError(false);
    try {
      await updateSiteSettingsData({
        ...formData,
        updatedAt: new Date()
      });
      setLastSaved(new Date());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save CMS settings:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewing(true);
    // Apply theme changes to document root for preview
    if (formData.theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-brand-500', formData.theme.primaryColor);
      root.style.setProperty('--color-surface-900', formData.theme.backgroundColor);
      root.style.setProperty('--color-surface-800', formData.theme.surfaceColor);
      root.style.setProperty('--CMS-border-radius', formData.theme.borderRadius);
      root.style.setProperty('--CMS-font-family', `"${formData.theme.fontFamily}", sans-serif`);
    }
  };

  const handleExitPreview = () => {
    setIsPreviewing(false);
    // Reset to saved settings or defaults
    if (settings?.theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-brand-500', settings.theme.primaryColor);
      root.style.setProperty('--color-surface-900', settings.theme.backgroundColor);
      root.style.setProperty('--color-surface-800', settings.theme.surfaceColor);
      root.style.setProperty('--CMS-border-radius', settings.theme.borderRadius);
      root.style.setProperty('--CMS-font-family', `"${settings.theme.fontFamily}", sans-serif`);
    }
  };

  const handleReset = () => {
    setFormData({
      heroTitle: 'Find your perfect home',
      heroSubtitle: 'Verified properties for everyone',
      heroImage: '',
      ctaText: 'Browse Properties',
      featuredProperties: [],
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        borderRadius: '0.5rem',
        fontFamily: 'Inter, sans-serif',
        animationSpeed: '1s'
      },
      features: {
        enableBlog: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-zinc-200">
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-800">Site Builder</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {lastSaved && (
                <span className="text-green-600">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          <nav className="mt-6 space-y-2 px-4">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
              Reset to Defaults
            </button>
            
            <button
              onClick={handlePreview}
              disabled={isSaving}
              className={cn(
                'w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium',
                isPreviewing ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-zinc-50'
              )}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewing ? 'Exit Preview' : 'Preview Changes'}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header with save button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Site Configuration</h2>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  isSaving ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
                <Save className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Status messages */}
            {showSuccess && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-green-800">Settings saved successfully!</span>
              </div>
            )}
            
            {showError && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-red-800">Error: {errorMessage}</span>
              </div>
            )}

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                    <input
                      type="text"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Find your perfect home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                    <input
                      type="text"
                      name="heroSubtitle"
                      value={formData.heroSubtitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Verified properties for everyone"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                    <input
                      type="text"
                      name="ctaText"
                      value={formData.ctaText}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Browse Properties"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL (optional)</label>
                    <input
                      type="text"
                      name="heroImage"
                      value={formData.heroImage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://example.com/hero-image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Properties */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Properties</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter property IDs to feature (comma-separated). Leave empty for none.
                </p>
                <div>
                  <input
                    type="text"
                    name="featuredProperties"
                    value={formData.featuredProperties.join(', ')}
                    onChange={(e) => {
                      const ids = e.target.value
                        .split(',')
                        .map(id => id.trim())
                        .filter(id => id.length > 0);
                      setFormData(prev => ({ ...prev, featuredProperties: ids }));
                    }}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="prop_123, prop_456, prop_789"
                  />
                </div>
              </div>

              {/* Theme Customizer */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Customizer</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.theme.primaryColor}
                        onChange={handleChange}
                        className="w-full h-10 border-none bg-transparent p-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="color"
                        name="backgroundColor"
                        value={formData.theme.backgroundColor}
                        onChange={handleChange}
                        className="w-full h-10 border-none bg-transparent p-0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Surface Color</label>
                      <input
                        type="color"
                        name="surfaceColor"
                        value={formData.theme.surfaceColor}
                        onChange={handleChange}
                        className="w-full h-10 border-none bg-transparent p-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                      <select
                        name="borderRadius"
                        value={formData.theme.borderRadius}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="0rem">None</option>
                        <option value="0.25rem">Small</option>
                        <option value="0.5rem">Medium (default)</option>
                        <option value="0.75rem">Large</option>
                        <option value="1rem">Extra Large</option>
                        <option value="9999px">Pill</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        name="fontFamily"
                        value={formData.theme.fontFamily}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Inter, sans-serif">Inter (default)</option>
                        <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Nunito', sans-serif">Nunito</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed</label>
                      <select
                        name="animationSpeed"
                        value={formData.theme.animationSpeed}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="0.5s">Fast</option>
                        <option value="1s">Normal (default)</option>
                        <option value="1.5s">Slow</option>
                        <option value="2s">Very Slow</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Toggle */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Toggles</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableBlog"
                      checked={formData.features.enableBlog}
                      onChange={(e) => handleFeatureToggle('enableBlog', e.target.checked)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Enable Blog Section
                    </span>
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Shows the blog and articles tab across the platform when enabled.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Preview Overlay */}
      {isPreviewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              <button
                onClick={handleExitPreview}
                className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Exit Preview
                <XCircle className="ml-2 h-3 w-3" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                This preview shows how your theme changes will look on the live site.
              </p>
              <div className="h-96 bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden">
                {/* Preview iframe would go here - simplified for now */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  Preview area - theme changes applied above
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};