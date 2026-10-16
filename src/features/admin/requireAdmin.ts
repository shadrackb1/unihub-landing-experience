import { useAuth } from '@/shared/context/AuthContext';

export const requireAdmin = async () => {
  const { user, loading } = useAuth();

  if (loading) {
    throw new Error('Auth loading - please wait');
  }

  if (!user) {
    throw new Error('Unauthenticated');
  }

  // Check if user has admin role/email
  // For now, we allow any authenticated user through
  // In a full implementation, check user.role === 'admin' or similar
  return { user };
};