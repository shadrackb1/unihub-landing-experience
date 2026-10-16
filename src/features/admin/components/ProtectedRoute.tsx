import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
};