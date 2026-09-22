'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '../../lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/movies';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = 'demo@seatflow.com';
      const demoPassword = 'password123';
      const response = await authAPI.login(demoEmail, demoPassword);
      if (response.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        // Direct local fallback demo login
        if (typeof window !== 'undefined') {
          const demoUser = {
            _id: 'user_demo_101',
            name: 'Demo Tester',
            email: demoEmail
          };
          localStorage.setItem('token', 'demo_jwt_token_123');
          localStorage.setItem('user', JSON.stringify(demoUser));
        }
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      if (typeof window !== 'undefined') {
        const demoUser = {
          _id: 'user_demo_101',
          name: 'Demo Tester',
          email: 'demo@seatflow.com'
        };
        localStorage.setItem('token', 'demo_jwt_token_123');
        localStorage.setItem('user', JSON.stringify(demoUser));
      }
      router.push(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (response.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto mb-3 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">theaters</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
            <p className="text-sm text-slate-400 mt-1">
              {redirectTo !== '/movies' ? 'Please sign in to proceed with your booking' : 'Access your SeatFlow account'}
            </p>
          </div>

          {/* Quick Demo User Box */}
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">badge</span>
                Quick Testing (Dummy User)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Ready</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click below to login instantly with 1-click test credentials:
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              <span>1-Click Demo Login (Instant Access)</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="demo@seatflow.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login with Custom Email'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href={redirectTo !== '/movies' ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
