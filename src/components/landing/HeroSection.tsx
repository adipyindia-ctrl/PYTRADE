import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { mockIndices } from '@/mocks/indices';
import { mockStocks } from '@/mocks/stocks';
import { formatINR, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

function MiniIndexCard({
  name,
  value,
  changePercent,
}: {
  name: string;
  value: number;
  changePercent: number;
}) {
  const positive = changePercent >= 0;
  return (
    <div className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
      <p className="text-xs font-medium text-white/70 truncate">{name}</p>
      <p className="text-sm font-bold text-white mt-0.5">
        {value.toLocaleString('en-IN')}
      </p>
      <p className={cn('text-xs font-medium mt-0.5', positive ? 'text-green-300' : 'text-red-300')}>
        {formatPercent(changePercent)}
      </p>
    </div>
  );
}

function DashboardPreview() {
  const previewStocks = mockStocks.slice(0, 3);

  return (
    <div className="relative bg-pytrade-navy rounded-2xl shadow-2xl overflow-hidden border border-white/10 p-4 sm:p-6">
      {/* Decorative top bar */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-white/40 font-mono">PYTRADE Dashboard</span>
      </div>

      {/* Index cards row */}
      <div className="flex gap-2 mb-4">
        {mockIndices.map((idx) => (
          <MiniIndexCard
            key={idx.id}
            name={idx.name}
            value={idx.value}
            changePercent={idx.changePercent}
          />
        ))}
      </div>

      {/* Placeholder chart */}
      <div className="relative h-28 rounded-xl bg-gradient-to-br from-pytrade-blue/30 to-pytrade-blue/10 mb-4 overflow-hidden border border-white/10">
        {/* SVG sparkline */}
        <svg
          viewBox="0 0 300 80"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0866F5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0866F5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C30,55 60,40 90,35 C120,30 150,45 180,38 C210,31 240,20 270,15 L300,12 L300,80 L0,80 Z"
            fill="url(#chartGrad)"
          />
          <path
            d="M0,60 C30,55 60,40 90,35 C120,30 150,45 180,38 C210,31 240,20 270,15 L300,12"
            fill="none"
            stroke="#0866F5"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute top-2 left-3 text-xs text-white/60">NIFTY 50 — Today</div>
        <div className="absolute bottom-2 right-3 text-xs font-bold text-green-400">+0.58%</div>
      </div>

      {/* Mini stock list */}
      <div className="space-y-2">
        {previewStocks.map((stock) => {
          const positive = stock.changePercent >= 0;
          return (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{stock.symbol}</p>
                <p className="text-xs text-white/50 truncate max-w-[120px]">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">
                  {formatINR(stock.price, true)}
                </p>
                <p
                  className={cn(
                    'text-xs font-medium',
                    positive ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {formatPercent(stock.changePercent)}
                </p>
              </div>
              {positive ? (
                <TrendingUp className="h-4 w-4 text-green-400 ml-2 shrink-0" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400 ml-2 shrink-0" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {/* Demo badge */}
      <div className="absolute top-3 right-4">
        <span className="text-[10px] font-semibold bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/30">
          DEMO
        </span>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative bg-gradient-to-br from-pytrade-navy via-[#162348] to-pytrade-navy overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Subtle background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pytrade-blue/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-pytrade-blue/5 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text + CTAs */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-pytrade-blue/20 border border-pytrade-blue/30 px-3 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-pytrade-blue/90 tracking-wide">
                Now in Beta
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Trade Smarter.{' '}
              <span className="text-pytrade-blue">Invest Better.</span>{' '}
              Grow Together.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              India&apos;s modern trading platform. Access stocks, ETFs, and IPOs
              with zero delivery brokerage.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-pytrade-blue px-8 text-base font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pytrade-blue focus-visible:ring-offset-2 focus-visible:ring-offset-pytrade-navy"
              >
                Open Free Account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-base font-semibold text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pytrade-navy"
              >
                Explore Dashboard
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-xs text-white/50">
              <span>✓ Zero delivery brokerage</span>
              <span>✓ No hidden charges</span>
              <span>✓ Demo platform</span>
            </div>
          </div>

          {/* Right: dashboard preview */}
          <div className="w-full">
            {/* Desktop: full preview */}
            <div className="hidden sm:block">
              <DashboardPreview />
            </div>
            {/* Mobile: compact index cards only */}
            <div className="sm:hidden">
              <div className="bg-pytrade-navy/60 rounded-2xl border border-white/10 p-4">
                <p className="text-xs font-semibold text-white/50 mb-3 tracking-wider">
                  MARKET OVERVIEW — DEMO DATA
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {mockIndices.map((idx) => {
                    const positive = idx.changePercent >= 0;
                    return (
                      <div
                        key={idx.id}
                        className="bg-white/5 rounded-xl p-3 border border-white/10"
                      >
                        <p className="text-xs text-white/60 font-medium">{idx.name}</p>
                        <p className="text-sm font-bold text-white mt-1">
                          {idx.value.toLocaleString('en-IN')}
                        </p>
                        <p
                          className={cn(
                            'text-xs font-semibold mt-0.5',
                            positive ? 'text-green-400' : 'text-red-400'
                          )}
                        >
                          {formatPercent(idx.changePercent)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
