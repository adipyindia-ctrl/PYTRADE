import Link from 'next/link';
import { TrendingUp, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Products: ['Stocks', 'ETFs', 'IPO', 'Mutual Funds'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Learn: ['Trading Guide', 'Market News', 'Glossary', 'Webinars'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Cookie Policy'],
};

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-pytrade-navy text-white" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top row: logo + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pytrade-blue rounded-md"
              aria-label="PYTRADE home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pytrade-blue">
                <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight">PYTRADE</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Modern trading for everyone.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
                {category}
              </h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Disclaimer */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
            <p className="text-xs text-white/50 leading-relaxed">
              <strong className="text-white/70 font-semibold">Disclaimer: </strong>
              PYTRADE is a technology demonstration platform. Not SEBI registered. Not a real
              broker. All data shown is simulated and for demonstration purposes only. Do not
              make financial decisions based on this platform.
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2025 PYTRADE. Demo platform. Not for real trading.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/70 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
