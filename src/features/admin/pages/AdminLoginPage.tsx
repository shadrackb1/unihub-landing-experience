import { useLoaderData } from '@tanstack/react-router';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { Mail, Lock, Loader2, Eye, EyeOff, Building } from 'lucide-react';

export const routeOptions = {
};

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate({ to: '/admin' });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link to="/admin" className="inline-flex items-center gap-2 mb-6">
              <Building className="w-8 h-8 text-brand-400" />
              <span className="text-2xl font-display font-medium tracking-tight text-white">UniHub Admin</span>
            </Link>
            <h1 className="text-2xl font-display font-medium text-white mb-2">Welcome Back</h1>
            <p className="text-zinc-400">Sign in to manage your platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                  placeholder="admin@unihub.ke"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-brand-500 rounded" />
                <span className="text-sm text-zinc-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-brand-400 hover:text-brand-300 font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-brand-500 text-black font-medium hover:bg-white hover:scale-105 transition-all font-display shadow-[0_0_20px_var(--color-brand-500)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link to="/admin/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Contact admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}