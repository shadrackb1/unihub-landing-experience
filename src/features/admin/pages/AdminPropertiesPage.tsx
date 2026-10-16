import { useLoaderData } from '@tanstack/react-router';
import { Loader2, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getProperties, deleteProperty } from '@/shared/services/firestore';
import { useState } from 'react';

export const routeOptions = {
  loader: async () => {
    const properties = await getProperties();
    return { properties };
  },
};

export function AdminPropertiesPage() {
  const { properties } = (useLoaderData({ strict: false }) as any);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'hidden'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    setDeletingId(id);
    try {
      await deleteProperty(id);
      // The list will refresh via the loader
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <span className="w-8 h-8" />
            Properties
          </h1>
          <p className="text-zinc-400 mt-2">Manage property listings</p>
        </div>
        <Link to="/admin/properties/new" className="px-6 py-3 flex items-center gap-2 rounded-xl bg-brand-500 text-black text-sm font-medium hover:bg-white hover:scale-105 transition-all font-display shadow-[0_0_20px_var(--color-brand-500)]">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-zinc-400 text-sm font-medium border-b border-zinc-800 pb-4">
                <th className="pb-4 text-left">Property</th>
                <th className="pb-4 text-left">Location</th>
                <th className="pb-4 text-left">Price</th>
                <th className="pb-4 text-left">Status</th>
                <th className="pb-4 text-left">Agent</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No properties found. <Link to="/admin/properties/new" className="text-brand-400 hover:underline">Add your first property</Link>
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {prop.media?.[0] ? (
                            <img src={prop.media[0].secure_url} alt={prop.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">🏠</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{prop.title}</p>
                          <p className="text-sm text-zinc-400">{prop.categoryId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-300">{prop.location}</td>
                    <td className="py-4 font-medium text-white">KES {prop.price.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prop.status === 'available' ? 'bg-green-500/20 text-green-400' :
                        prop.status === 'occupied' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-4 text-zinc-300">{prop.agentId}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/properties/${prop.id}`} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5a2.121 2.121 0 013 3z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          disabled={deletingId === prop.id}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {deletingId === prop.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}