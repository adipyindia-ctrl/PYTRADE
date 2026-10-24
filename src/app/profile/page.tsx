'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppSelector, useAppDispatch } from '@/store';
import { removeAlert, toggleAlert, addAlert } from '@/store/priceAlertSlice';
import { mockStocks } from '@/mocks/stocks';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  User,
  Shield,
  Bell,
  TrendingUp,
  Building2,
  HelpCircle,
  Gift,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

type SectionId =
  | 'personal'
  | 'banks'
  | 'kyc'
  | 'security'
  | 'notifications'
  | 'alerts'
  | 'refer'
  | 'support';

interface NotifPrefs {
  orders: boolean;
  priceAlerts: boolean;
  marketUpdates: boolean;
  accountActivity: boolean;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const linkedBanks = useAppSelector((s) => s.bank.linkedBanks);
  const alerts = useAppSelector((s) => s.priceAlerts.alerts);
  const [activeSection, setActiveSection] = useState<SectionId>('personal');

  // notification prefs
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    orders: true,
    priceAlerts: true,
    marketUpdates: false,
    accountActivity: true,
  });

  // price alert form
  const [alertSymbol, setAlertSymbol] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  // change password form
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwVisible, setPwVisible] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const user = session?.user;

  const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'banks', label: 'Bank Accounts', icon: Building2 },
    { id: 'kyc', label: 'KYC Status', icon: CheckCircle2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'alerts', label: 'Price Alerts', icon: TrendingUp },
    { id: 'refer', label: 'Refer & Earn', icon: Gift },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const notifLabels: {
    key: keyof NotifPrefs;
    label: string;
    desc: string;
  }[] = [
    {
      key: 'orders',
      label: 'Order Notifications',
      desc: 'Get notified when orders are placed or executed',
    },
    {
      key: 'priceAlerts',
      label: 'Price Alerts',
      desc: 'Receive alerts when stocks hit your target price',
    },
    {
      key: 'marketUpdates',
      label: 'Market Updates',
      desc: 'Daily market summary and major movements',
    },
    {
      key: 'accountActivity',
      label: 'Account Activity',
      desc: 'Login alerts and account changes',
    },
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-6">
        {/* Profile header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-pytrade-blue flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-pytrade-navy text-lg">{user?.name ?? 'Demo User'}</h2>
            <p className="text-sm text-gray-500 truncate">{user?.email ?? 'demo@pytrade.in'}</p>
            <span className="text-xs bg-green-50 text-positive px-2 py-0.5 rounded-full">
              Active Demo Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left nav */}
          <div className="lg:col-span-1">
            {/* Mobile: horizontal scroll tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors',
                    activeSection === s.id
                      ? 'bg-pytrade-blue text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
            {/* Desktop: vertical nav */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0',
                    activeSection === s.id
                      ? 'bg-blue-50 text-pytrade-blue font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <s.icon className="h-4 w-4" />
                    {s.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </button>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-negative hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-3">
            {/* PERSONAL INFO */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">Personal Information</h3>
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                  Demo account — profile editing is simulated
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: user?.name ?? 'Demo User' },
                    { label: 'Email', value: user?.email ?? 'demo@pytrade.in' },
                    { label: 'Mobile', value: '+91 XXXXXX1234' },
                    { label: 'Account Type', value: 'Demo Account' },
                    { label: 'Member Since', value: 'Jan 2025' },
                    { label: 'PAN', value: 'XXXXX1234X (masked)' },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                      <p className="text-sm font-medium text-pytrade-navy bg-gray-50 rounded-xl px-3 py-2.5">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Profile updates require real authentication integration.
                </p>
              </div>
            )}

            {/* BANK ACCOUNTS */}
            {activeSection === 'banks' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-pytrade-navy">Bank Accounts</h3>
                  <Link href="/bank-accounts" className="text-xs text-pytrade-blue hover:underline">
                    Manage Banks
                  </Link>
                </div>
                {linkedBanks.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No banks linked yet</p>
                    <Link
                      href="/bank-accounts"
                      className="mt-3 inline-block bg-pytrade-blue text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Link Bank Account
                    </Link>
                  </div>
                ) : (
                  linkedBanks.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-pytrade-navy text-sm">{bank.bankName}</p>
                        <p className="text-xs text-gray-500">
                          {bank.holderName} · {bank.maskedAccount}
                        </p>
                      </div>
                      {bank.isPrimary && (
                        <span className="text-xs bg-green-50 text-positive px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* KYC STATUS */}
            {activeSection === 'kyc' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">KYC Status</h3>
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-pytrade-navy">KYC In Progress (Demo)</p>
                    <p className="text-xs text-gray-500">
                      Complete all 5 steps to finish demo KYC verification
                    </p>
                  </div>
                </div>
                {[
                  { step: 'PAN Verification', done: true },
                  { step: 'Aadhaar Verification', done: true },
                  { step: 'Personal Details', done: false },
                  { step: 'Bank Account', done: false },
                  { step: 'Documents & eSign', done: false },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-700">{s.step}</span>
                    {s.done ? (
                      <span className="text-xs text-positive font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Done
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </div>
                ))}
                <Link
                  href="/kyc"
                  className="block w-full bg-pytrade-blue text-white rounded-xl py-3 text-sm font-semibold text-center hover:bg-blue-700"
                >
                  Continue KYC
                </Link>
              </div>
            )}

            {/* SECURITY */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">Security</h3>
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                  Password changes in this demo update your real MongoDB account credentials.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Current Password</label>
                    <div className="relative">
                      <input
                        type={pwVisible ? 'text' : 'password'}
                        value={pwForm.current}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPwForm((p) => ({ ...p, current: e.target.value }))
                        }
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full pr-10 focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
                      />
                      <button
                        onClick={() => setPwVisible((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        type="button"
                      >
                        {pwVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">New Password</label>
                    <input
                      type="password"
                      value={pwForm.next}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPwForm((p) => ({ ...p, next: e.target.value }))
                      }
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPwForm((p) => ({ ...p, confirm: e.target.value }))
                      }
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
                    />
                  </div>
                  {pwMsg && (
                    <p
                      className={cn(
                        'text-sm',
                        pwMsg.includes('success') || pwMsg.includes('updated')
                          ? 'text-positive'
                          : 'text-negative'
                      )}
                    >
                      {pwMsg}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!pwForm.current || !pwForm.next) {
                        setPwMsg('Please fill all fields');
                        return;
                      }
                      if (pwForm.next !== pwForm.confirm) {
                        setPwMsg('Passwords do not match');
                        return;
                      }
                      if (pwForm.next.length < 8) {
                        setPwMsg('Password must be at least 8 characters');
                        return;
                      }
                      setPwMsg(
                        'Password updated (demo only — actual server update not implemented in UI phase)'
                      );
                      setPwForm({ current: '', next: '', confirm: '' });
                    }}
                    className="w-full bg-pytrade-blue text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-pytrade-navy text-sm mb-3">Session</h4>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full border-2 border-negative text-negative rounded-xl py-3 text-sm font-semibold hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">Notification Preferences</h3>
                <p className="text-xs text-gray-400">Demo preferences — stored in session state only</p>
                {notifLabels.map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-pytrade-navy">{pref.label}</p>
                      <p className="text-xs text-gray-500">{pref.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))
                      }
                      className={cn(
                        'relative w-10 h-6 rounded-full transition-colors',
                        notifPrefs[pref.key] ? 'bg-pytrade-blue' : 'bg-gray-200'
                      )}
                      aria-label={`Toggle ${pref.label}`}
                      role="switch"
                      aria-checked={notifPrefs[pref.key]}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                          notifPrefs[pref.key] ? 'translate-x-4' : ''
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* PRICE ALERTS */}
            {activeSection === 'alerts' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">Price Alerts</h3>
                <p className="text-xs text-gray-400">
                  Demo alerts — no real push notifications are sent
                </p>
                {/* Create alert form */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-pytrade-navy">Create Alert</h4>
                  <select
                    value={alertSymbol}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setAlertSymbol(e.target.value)
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
                  >
                    <option value="">Select Stock</option>
                    {mockStocks.map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} — {s.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <select
                      value={alertCondition}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setAlertCondition(e.target.value as 'ABOVE' | 'BELOW')
                      }
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm flex-1 focus:outline-none"
                    >
                      <option value="ABOVE">Above</option>
                      <option value="BELOW">Below</option>
                    </select>
                    <input
                      type="number"
                      step={0.05}
                      value={alertPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAlertPrice(e.target.value)
                      }
                      placeholder="Target Price"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm flex-1 focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!alertSymbol || !alertPrice) return;
                      const stock = mockStocks.find((s) => s.symbol === alertSymbol);
                      if (!stock) return;
                      dispatch(
                        addAlert({
                          symbol: alertSymbol,
                          name: stock.name,
                          targetPrice: Number(alertPrice),
                          condition: alertCondition,
                          active: true,
                        })
                      );
                      setAlertSymbol('');
                      setAlertPrice('');
                    }}
                    className="w-full bg-pytrade-blue text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-700"
                  >
                    Set Alert
                  </button>
                </div>
                {/* Existing alerts */}
                {alerts.length === 0 ? (
                  <p className="text-center text-gray-400 py-4 text-sm">No price alerts set</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-bold text-pytrade-navy">{alert.symbol}</p>
                          <p className="text-xs text-gray-500">
                            {alert.condition} {formatINR(alert.targetPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => dispatch(toggleAlert(alert.id))}
                            className={cn(
                              'text-xs px-2 py-1 rounded-lg font-medium',
                              alert.active
                                ? 'bg-green-50 text-positive'
                                : 'bg-gray-200 text-gray-500'
                            )}
                          >
                            {alert.active ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch(removeAlert(alert.id))}
                            className="text-negative hover:bg-red-50 p-1 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REFER & EARN */}
            {activeSection === 'refer' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 text-center">
                <Gift className="h-12 w-12 text-pytrade-blue mx-auto" />
                <h3 className="font-bold text-pytrade-navy text-lg">Refer &amp; Earn</h3>
                <p className="text-gray-500 text-sm">Share PYTRADE with friends and earn demo rewards.</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Your Demo Referral Code</p>
                  <p className="font-mono font-bold text-pytrade-navy text-lg">PYTRADE2025</p>
                </div>
                <p className="text-xs text-gray-400">This is a demo referral code. No real rewards are issued.</p>
              </div>
            )}

            {/* HELP & SUPPORT */}
            {activeSection === 'support' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-pytrade-navy">Help &amp; Support</h3>
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                  PYTRADE is a demo application. Contact information below is for demonstration only.
                </p>
                {/* FAQ */}
                <div className="space-y-2">
                  {[
                    {
                      q: 'Is PYTRADE a real broker?',
                      a: 'No. PYTRADE is a technology demo. It is not SEBI-registered and does not execute real trades.',
                    },
                    {
                      q: 'Is my money safe?',
                      a: 'PYTRADE does not hold real funds. The balance shown is a demo simulation only.',
                    },
                    {
                      q: 'How do I reset my password?',
                      a: 'Use the login page to sign in, then go to Profile → Security to change your password.',
                    },
                    {
                      q: 'What is the demo OTP?',
                      a: 'For development testing, the OTP is 123456. This will be replaced with real SMS delivery in production.',
                    },
                  ].map((faq, i) => (
                    <details key={i} className="bg-gray-50 rounded-xl p-4">
                      <summary className="font-medium text-pytrade-navy text-sm cursor-pointer">
                        {faq.q}
                      </summary>
                      <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
                    </details>
                  ))}
                </div>
                {/* Demo support form */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-pytrade-navy text-sm">
                    Contact Support (Demo Form)
                  </h4>
                  <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none">
                    <option>Select Issue Type</option>
                    <option>Account Access</option>
                    <option>Order Issue</option>
                    <option>Payment Issue</option>
                    <option>Technical Problem</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Describe your issue..."
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    className="w-full bg-pytrade-blue text-white rounded-xl py-2.5 text-sm font-semibold"
                    onClick={() =>
                      alert('Support request submitted (demo — no real ticket created)')
                    }
                  >
                    Submit (Demo)
                  </button>
                </div>
              </div>
            )}

            {/* Mobile sign out */}
            <div className="lg:hidden mt-4">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center justify-center gap-2 border-2 border-negative text-negative rounded-xl py-3 text-sm font-semibold hover:bg-red-50 bg-white"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
