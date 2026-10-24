import { Zap, BarChart2, TrendingUp, Shield, Smartphone, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    title: 'Zero Brokerage on Delivery',
    description:
      'Buy and hold stocks with absolutely zero brokerage charges. Keep more of your returns and invest for the long term without worrying about costs.',
  },
  {
    icon: BarChart2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-pytrade-blue',
    title: 'Advanced Charts',
    description:
      'Professional-grade charting tools with multiple timeframes, technical indicators, and drawing tools to help you analyse markets with confidence.',
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Lightning Fast Execution',
    description:
      'Place orders at market speed with a responsive trading interface designed for both beginners and experienced traders.',
  },
  {
    icon: Shield,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    title: 'Bank-Grade Security',
    description:
      'Your account is protected with industry-standard encryption, two-factor authentication, and round-the-clock system monitoring.',
  },
  {
    icon: Smartphone,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    title: 'Mobile Trading',
    description:
      'A fully native mobile experience. Monitor your portfolio, place orders, and track markets from anywhere with a tap.',
  },
  {
    icon: Star,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    title: 'IPO Investing',
    description:
      'Apply for IPOs directly from the platform with a simple UPI-based payment flow. Never miss a listing opportunity.',
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl shrink-0',
          feature.iconBg
        )}
      >
        <Icon className={cn('h-6 w-6', feature.iconColor)} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-pytrade-navy">{feature.title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-page-bg py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pytrade-navy"
          >
            Everything you need to trade with confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Built from the ground up for Indian retail investors with a focus on simplicity,
            speed, and smart tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
