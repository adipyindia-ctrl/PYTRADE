'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, Eye, EyeOff, Check, X } from 'lucide-react';

type TabType = 'mobile' | 'email';

function getPasswordScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

export default function SignupPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('mobile');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const identifier = tab === 'mobile' ? mobile : email;
  const score = getPasswordScore(password);
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One digit', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (tab === 'mobile' && !/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (tab === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    if (score < 4) {
      setError('Password does not meet all requirements');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Failed to send OTP');
        return;
      }

      // Store draft in sessionStorage
      sessionStorage.setItem(
        'pytrade_signup_draft',
        JSON.stringify({ name: name.trim(), identifier, type: tab, password })
      );

      router.push(`/verify-otp?type=${tab}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6 sm:p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-pytrade-blue rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-pytrade-navy tracking-tight">PYTRADE</span>
        </div>

        <h1 className="text-2xl font-bold text-pytrade-navy mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-5">Open your free trading account</p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {(['mobile', 'email'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t
                  ? 'bg-white text-pytrade-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'mobile' ? 'Mobile' : 'Email'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pytrade-blue focus:border-transparent w-full outline-none"
            />
          </div>

          {tab === 'mobile' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="border border-r-0 border-gray-200 rounded-l-xl px-3 py-3 text-sm text-gray-500 bg-gray-50">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="border border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pytrade-blue focus:border-transparent flex-1 outline-none"
                  maxLength={10}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pytrade-blue focus:border-transparent w-full outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pytrade-blue focus:border-transparent w-full pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < score ? strengthColors[score - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Strength:{' '}
                  <span
                    className={`font-medium ${
                      score <= 1
                        ? 'text-red-500'
                        : score === 2
                        ? 'text-orange-500'
                        : score === 3
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {score > 0 ? strengthLabels[score - 1] : 'Very Weak'}
                  </span>
                </p>
              </div>
            )}

            {/* Requirements */}
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {requirements.map((req) => (
                  <li key={req.label} className="flex items-center gap-1.5 text-xs">
                    {req.met ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-red-400" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>{req.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pytrade-blue focus:border-transparent w-full outline-none"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-negative text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-pytrade-blue"
            />
            <span className="text-xs text-gray-500">
              I agree to the{' '}
              <span className="text-pytrade-blue">Terms &amp; Conditions</span> and{' '}
              <span className="text-pytrade-blue">Privacy Policy</span>
            </span>
          </label>

          {error && (
            <p className="text-negative text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP…' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-pytrade-blue font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
