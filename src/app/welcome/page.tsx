import Link from 'next/link';
import { TrendingUp, CheckCircle } from 'lucide-react';

const features = [
  'Open Demat & Trading Account',
  'Trade in Stocks, F&O, IPOs',
  'Real-time Market Data',
  'Secure & Trusted Platform',
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6 sm:p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-pytrade-blue rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-pytrade-navy tracking-tight">PYTRADE</span>
        </div>

        {/* Chart illustration */}
        <div className="w-full h-32 mb-6 rounded-xl bg-blue-50 flex items-end justify-center px-4 pb-4 overflow-hidden">
          <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points="0,70 40,55 80,60 120,35 160,40 200,20 240,25 300,10"
              fill="none"
              stroke="#0866F5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points="0,70 40,55 80,60 120,35 160,40 200,20 240,25 300,10 300,80 0,80"
              fill="url(#grad)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0866F5" />
                <stop offset="100%" stopColor="#0866F5" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-pytrade-navy mb-2">Invest in Your Future</h1>
        <p className="text-gray-500 text-sm mb-6">
          Trade Stocks, F&O, Mutual Funds, IPOs with a simple and powerful platform.
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-positive flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <Link
          href="/signup"
          className="block w-full bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold text-center hover:bg-blue-700 transition-colors mb-4"
        >
          Get Started
        </Link>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-pytrade-blue font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
