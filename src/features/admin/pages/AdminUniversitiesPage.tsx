import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Plus, Search, Building } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getUniversities, deleteUniversity } from '@/shared/services/firestore';
import { useState } from 'react';

export const Route = createFileRoute('/admin/universities')({
  loader: async () => {
    const universities = await getUniversities();
    return { universities };
  },
  component: AdminUniversitiesPage,
});

export function AdminUniversitiesPage() {
  const { universities } = Route.useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || uni.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    setDeletingId(id);
    try {
      await deleteUniversity(id);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete university');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-purple-400" />
            Universities
          </h1>
          <p className="text-zinc-400 mt-2">Manage university listings</p>
        </div>
        <Link to="/admin/universities/new" className="px-6 py-3 flex items-center gap-2 rounded-xl bg-purple-500 text-black text-sm font-medium hover:bg-purple-400 hover:scale-105 transition-all font-display shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <Plus className="w-4 h-4" /> Add University
        </Link>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-zinc-400 text-sm font-medium border-b border-zinc-800 pb-4">
                <th className="pb-4 text-left">University</th>
                <th className="pb-4 text-left">Code</th>
                <th className="pb-4 text-left">Location</th>
                <th className="pb-4 text-left">Status</th>
                <th className="pb-4 text-left">Contact</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No universities yet. <Link to="/admin/universities/new" className="text-purple-400 hover:underline">Add your first university</Link>
                  </td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {uni.logo_url ? (
                            <img src={uni.logo_url} alt={uni.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">🏫</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{uni.name}</p>
                          <p className="text-sm text-zinc-400">{uni.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-zinc-300">{uni.slug}</td>
                    <td className="py-4 text-zinc-300">{uni.location}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        uni.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        {uni.status}
                      </span>
                    </td>
                    <td className="py-4 text-zinc-300">
                      {uni.contact_email && <div>📧 {uni.contact_email}</div>}
                      {uni.contact_phone && <div>📞 {uni.contact_phone}</div>}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/universities/${uni.id}`} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5a2.121 2.121 0 013 3z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(uni.id)}
                          disabled={deletingId === uni.id}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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