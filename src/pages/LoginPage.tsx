import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#F6F4F1]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="w-full max-w-md px-6 py-12 relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#1a1a1a] tracking-tight">
            TaskFlow
          </h1>
          <p className="text-[#6b6b6b] mt-2 text-sm">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <p className="text-red-500 text-sm text-center">{localError || error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-[#6b6b6b]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1a1a1a] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}