import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from '@tanstack/react-router';
import { 
  LayoutDashboard, Home, Users, Tag, Settings, LogOut, Menu, X, Monitor, School, Building, Palette, Layout, MousePointerClick, Users as UsersIcon 
} from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { cn } from '@/shared/lib/utils';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/properties', icon: Home, label: 'Properties' },
    { to: '/admin/universities', icon: Building, label: 'Universities' },
    { to: '/admin/hostels', icon: Building, label: 'Hostels' },
    { to: '/admin/cms', icon: Monitor, label: 'Site Builder' },
    { to: '/admin/agents', icon: Users, label: 'Agents' },
    { to: '/admin/categories', icon: Tag, label: 'Categories' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    // This would need the actual logout function from auth
    // For now, just navigate to login
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
        <div className="text-xl font-display font-medium tracking-tight">UniHub Admin</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-zinc-900 border-r border-zinc-800 flex-col transition-transform duration-300 fixed md:relative z-40 inset-y-0 left-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}
      >
        <div className="p-6 border-b border-zinc-800 hidden md:block">
          <div className="text-2xl font-display font-medium tracking-tight">UniHub Admin</div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.to}
              href={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  item.to === window.location.pathname
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function handleLogout() {
  // This will be replaced by the actual logout function
  window.location.href = '/admin/login';
}