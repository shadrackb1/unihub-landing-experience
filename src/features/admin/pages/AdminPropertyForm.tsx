import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { getProperty, createProperty, updateProperty } from '@/shared/services/firestore';
import { getCategoriesList, getAgentsList } from '@/shared/services/firestore';
import { uploadMedia } from '@/shared/lib/storage';
import { cn } from '@/shared/lib/utils';
import { motion } from 'motion/react';

export const Route = createFileRoute('/admin/properties/$id')({
  loader: async ({ params }) => {
    const { id } = params;
    if (id === 'new') return { property: null, categories: [], agents: [] };
    
    const [property, categories, agents] = await Promise.all([
      getProperty(id),
      getCategoriesList(),
      getAgentsList(),
    ]);
    
    if (!property) throw new Error('Property not found');
    
    return { property, categories, agents };
  },
  component: AdminPropertyForm,
});

export function AdminPropertyForm() {
  const { property, categories, agents } = Route.useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const isNew = params.id === 'new';
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: property?.title || '',
    categoryId: property?.categoryId || '',
    price: property?.price?.toString() || '',
    deposit: property?.deposit?.toString() || '',
    location: property?.location || '',
    coordinates: property?.coordinates ? `${property.coordinates.lat},${property.coordinates.lng}` : '',
    description: property?.description || '',
    features: property?.features?.join(', ') || '',
    agentId: property?.agentId || '',
    status: property?.status || 'available',
    media: property?.media || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'features') {
      setFormData(prev => ({ ...prev, features: value }));
    } else if (name === 'coordinates') {
      setFormData(prev => ({ ...prev, coordinates: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImages(prev => ({ ...prev, [index]: true }));
    try {
      const media = await uploadMedia(file);
      const newPreviews = [...imagePreviews];
      newPreviews[index] = media.secure_url;
      setImagePreviews(newPreviews);
      setFormData(prev => ({
        ...prev,
        media: prev.media.map((m, i) => i === index ? { ...m, secure_url: media.secure_url, public_id: media.public_id } : m),
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(index, file);
  };

  const addImageSlot = () => {
    const newMedia: MediaItem = {
      public_id: '',
      secure_url: '',
      resource_type: 'image',
      format: '',
      order: imagePreviews.length,
    };
    setImagePreviews(prev => [...prev, '']);
    setFormData(prev => ({ ...prev, media: [...prev.media, newMedia] }));
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        deposit: formData.deposit ? Number(formData.deposit) : undefined,
        coordinates: formData.coordinates ? formData.coordinates.split(',').map(Number) : undefined,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        media: formData.media.filter(m => m.secure_url),
      };

      if (isNew) {
        await createProperty(data);
      } else {
        await updateProperty(params.id, data);
      }
      navigate('/admin/properties');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (property?.media) {
      setImagePreviews(property.media.map(m => m.secure_url));
    }
  }, [property]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/properties" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
              <span className="w-8 h-8" />
              {isNew ? 'New Property' : 'Edit Property'}
            </h1>
            <p className="text-zinc-400 mt-2">{isNew ? 'Create a new property listing' : `Editing: ${property?.title}`}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/properties" className="px-4 py-2 flex items-center gap-2 rounded-xl border border-zinc-800 text-sm font-medium hover:bg-zinc-800 transition-all font-display">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            type="submit"
            form="property-form"
            disabled={isSaving}
            className="px-6 py-3 flex items-center gap-2 rounded-xl bg-brand-500 text-black text-sm font-medium hover:bg-white hover:scale-105 transition-all font-display shadow-[0_0_20px_var(--color-brand-500)]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isSaving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </div>

      <form id="property-form" onSubmit={handleSubmit} className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-display font-medium text-white mb-6">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Title *</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g., Modern Bedsitter in Juja Town"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Price (KES/month) *</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="9500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Deposit (KES)</label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="9500"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Location *</label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g., Near JKUAT, Juja"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Coordinates (lat,lng)</label>
                <input
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="-1.093, 37.015"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Agent</label>
                <select
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select agent (optional)</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-display font-medium text-white mb-6">Description & Features</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 resize-none"
                  placeholder="Describe the property in detail..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Features (comma separated)</label>
                <input
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  placeholder="Wifi, Water, Security, Parking, Laundry"
                />
                <p className="text-xs text-zinc-500">Separate features with commas</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-display font-medium text-white mb-6">Images</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                  {preview ? (
                    <img src={preview} alt={`Property image ${index + 1}`} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl">
                      <ImageIcon className="w-10 h-10 text-zinc-600" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadingImages[index] && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageSlot}
                disabled={imagePreviews.length >= 10}
                className="col-span-full aspect-video bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-zinc-700/50 transition-all"
              >
                <Plus className="w-8 h-8 text-zinc-500" />
                <span className="sr-only">Add image</span>
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-center">Maximum 10 images. Drag to reorder (not implemented yet).</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-medium text-white">Status</h2>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}