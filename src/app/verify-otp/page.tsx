'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Info } from 'lucide-react';
import { Suspense } from 'react';

interface SignupDraft {
  name: string;
  identifier: string;
  type: string;
  password: string;
}

function maskIdentifier(identifier: string, type: string): string {
  if (type === 'mobile') {
    return `+91 XXXXXX${identifier.slice(-4)}`;
  }
  const [local, domain] = identifier.split('@');
  const masked = local.slice(0, 2) + '****';
  return `${masked}@${domain}`;
}

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? 'mobile';

  const [draft, setDraft] = useState<SignupDraft | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('pytrade_signup_draft');
    if (stored) {
      try {
        setDraft(JSON.parse(stored) as SignupDraft);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = text[i] ?? '';
    }
    setOtp(newOtp);
    const lastFilled = Math.min(text.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    if (!draft) {
      setError('Session expired. Please start over.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: draft.identifier, otp: otpString }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Verification failed');
        return;
      }
      router.push('/set-password');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [otp, draft, router]);

  const handleResend = async () => {
    if (!draft) return;
    setError('');
    setCanResend(false);
    setCountdown(30);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: draft.identifier }),
      });
    } catch {
      setError('Failed to resend OTP');
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

        <h1 className="text-2xl font-bold text-pytrade-navy mb-1">Verify OTP</h1>
        <p className="text-gray-500 text-sm mb-2">
          Enter the 6-digit OTP sent to
        </p>
        {draft && (
          <p className="text-pytrade-navy font-semibold text-sm mb-5">
            {maskIdentifier(draft.identifier, type)}
          </p>
        )}

        {/* Demo banner */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
          <Info className="w-4 h-4 text-pytrade-blue mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Demo Mode:</span> Enter OTP{' '}
            <span className="font-mono font-bold">123456</span> to continue
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2 mb-5 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-pytrade-blue focus:ring-2 focus:ring-pytrade-blue/20 outline-none transition-colors"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-negative text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>

        {/* Resend */}
        <div className="text-center mb-4">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-pytrade-blue text-sm font-medium hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend OTP in <span className="font-semibold text-pytrade-navy">{countdown}s</span>
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Wrong number?{' '}
          <Link href="/signup" className="text-pytrade-blue font-medium hover:underline">
            Change mobile/email
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page-bg flex items-center justify-center"><div className="text-gray-500">Loading…</div></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
