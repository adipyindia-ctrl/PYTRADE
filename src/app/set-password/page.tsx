'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Eye, EyeOff, Check, X } from 'lucide-react';

interface SignupDraft {
  name: string;
  identifier: string;
  type: string;
  password: string;
}

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

export default function SetPasswordPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<SignupDraft | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('pytrade_signup_draft');
    if (stored) {
      try {
        const d = JSON.parse(stored) as SignupDraft;
        setDraft(d);
        setPassword(d.password ?? '');
      } catch {
        // ignore
      }
    }
  }, []);

  const score = getPasswordScore(password);
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One digit', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handlePinChange = (
    index: number,
    value: string,
    arr: string[],
    setArr: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newArr = [...arr];
    newArr[index] = digit;
    setArr(newArr);
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    arr: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !arr[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!draft) {
      setError('Session expired. Please start signup again.');
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
    if (pin.join('').length !== 6) {
      setError('Please set a 6-digit trading PIN');
      return;
    }
    if (pin.join('') !== confirmPin.join('')) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          identifier: draft.identifier,
          type: draft.type,
          password,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Failed to create account');
        return;
      }
      sessionStorage.removeItem('pytrade_signup_draft');
      router.push('/account-activated');
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

        <h1 className="text-2xl font-bold text-pytrade-navy mb-1">Set Password &amp; PIN</h1>
        <p className="text-gray-500 text-sm mb-5">Almost done! Set your login password and trading PIN.</p>

        <form onSubmit={handleCreateAccount} className="space-y-5">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
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

            {password.length > 0 && (
              <>
                <div className="flex gap-1 mt-2 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < score ? strengthColors[score - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  Strength:{' '}
                  <span className={`font-medium ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-orange-500' : score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {score > 0 ? strengthLabels[score - 1] : 'Very Weak'}
                  </span>
                </p>
                <ul className="space-y-1">
                  {requirements.map((req) => (
                    <li key={req.label} className="flex items-center gap-1.5 text-xs">
                      {req.met ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-red-400" />}
                      <span className={req.met ? 'text-green-700' : 'text-gray-500'}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </>
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

          {/* Trading PIN */}
          <div>
            <h2 className="text-sm font-semibold text-pytrade-navy mb-1">6-digit Trading PIN</h2>
            <p className="text-xs text-gray-500 mb-2">Used to authorize trades within the app</p>
            <div className="flex gap-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { pinRefs.current[index] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, pin, setPin, pinRefs)}
                  onKeyDown={(e) => handlePinKeyDown(index, e, pin, pinRefs)}
                  className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-pytrade-blue focus:ring-2 focus:ring-pytrade-blue/20 outline-none transition-colors"
                  aria-label={`PIN digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm PIN</label>
            <div className="flex gap-2">
              {confirmPin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { confirmPinRefs.current[index] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, confirmPin, setConfirmPin, confirmPinRefs)
                  }
                  onKeyDown={(e) => handlePinKeyDown(index, e, confirmPin, confirmPinRefs)}
                  className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-pytrade-blue focus:ring-2 focus:ring-pytrade-blue/20 outline-none transition-colors"
                  aria-label={`Confirm PIN digit ${index + 1}`}
                />
              ))}
            </div>
            {confirmPin.join('').length === 6 && pin.join('') !== confirmPin.join('') && (
              <p className="text-negative text-xs mt-1">PINs do not match</p>
            )}
          </div>

          {error && (
            <p className="text-negative text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
