'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Eye, EyeOff, Upload, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch } from '@/store';
import { addBank } from '@/store/bankSlice';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const BANKS = [
  'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Yes Bank', 'IndusInd Bank',
];

const STEP_LABELS = ['PAN', 'Aadhaar', 'Personal', 'Bank', 'Documents'];

// ─── Shared input style ────────────────────────────────────────────────────────

const inputCls =
  'border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pytrade-blue w-full';
const primaryBtnCls =
  'bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors w-full';
const outlineBtnCls =
  'border-2 border-pytrade-blue text-pytrade-blue rounded-xl px-4 py-3 font-semibold hover:bg-blue-50 transition-colors';

// ─── StepProgress ─────────────────────────────────────────────────────────────

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center w-full">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const completed = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                  completed && 'bg-positive text-white',
                  active && 'bg-pytrade-blue text-white',
                  !completed && !active && 'bg-gray-100 text-gray-400'
                )}
              >
                {completed ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium hidden sm:block',
                  active ? 'text-pytrade-blue' : 'text-gray-400'
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-14 mx-1 sm:mx-2 transition-colors',
                  stepNum < currentStep ? 'bg-positive' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: PAN Verification ─────────────────────────────────────────────────

function StepPAN({ onNext }: { onNext: () => void }) {
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const validatePAN = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);

  const handleVerify = async () => {
    if (!validatePAN(pan)) {
      setError('Invalid PAN format. Example: ABCDE1234F');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setVerified(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pytrade-navy">PAN Verification</h2>
      <p className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
        Demo: Use any valid format PAN like <strong>ABCDE1234F</strong>
      </p>
      <input
        value={pan}
        onChange={(e) => setPan(e.target.value.toUpperCase())}
        placeholder="Enter PAN (e.g. ABCDE1234F)"
        maxLength={10}
        className={inputCls}
        disabled={verified}
        aria-label="PAN number"
      />
      {error && <p className="text-negative text-sm mt-1">{error}</p>}
      {verified ? (
        <div className="flex items-center gap-2 text-positive text-sm font-medium">
          <CheckCircle2 className="h-5 w-5" /> PAN Demo Verified
        </div>
      ) : (
        <button
          onClick={handleVerify}
          disabled={loading || !pan}
          className={primaryBtnCls}
        >
          {loading ? 'Verifying…' : 'Verify PAN'}
        </button>
      )}
      {verified && (
        <button onClick={onNext} className={primaryBtnCls}>
          Continue →
        </button>
      )}
    </div>
  );
}

// ─── Step 2: Aadhaar Verification ─────────────────────────────────────────────

function StepAadhaar({ onNext }: { onNext: () => void }) {
  const [aadhaar, setAadhaar] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [consent, setConsent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (aadhaar.length !== 12) { setError('Enter valid 12-digit Aadhaar number'); return; }
    if (!consent) { setError('Please provide consent to continue'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (otp !== '123456') { setError('Incorrect OTP. Demo hint: use 123456'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setVerified(true);
  };

  const maskedDisplay = aadhaar.length >= 4
    ? `XXXX XXXX ${aadhaar.slice(-4)}`
    : '';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pytrade-navy">Aadhaar Verification</h2>
      <p className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
        <strong>DEMO ONLY</strong> — Do not enter real Aadhaar. This form does not verify actual UIDAI data.
      </p>
      {!verified && (
        <>
          <div className="relative">
            <input
              type={showAadhaar ? 'text' : 'password'}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="12-digit Aadhaar number"
              className={inputCls}
              disabled={otpSent}
              aria-label="Aadhaar number"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowAadhaar((v) => !v)}
              aria-label={showAadhaar ? 'Hide Aadhaar' : 'Show Aadhaar'}
            >
              {showAadhaar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-pytrade-blue"
            />
            I consent to demo Aadhaar verification
          </label>
          {error && <p className="text-negative text-sm mt-1">{error}</p>}
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading || aadhaar.length !== 12}
              className={primaryBtnCls}
            >
              {loading ? 'Sending…' : 'Send Demo OTP'}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                OTP sent to registered mobile. <span className="text-pytrade-blue font-medium">(Demo hint: enter 123456)</span>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={inputCls}
                aria-label="OTP"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className={primaryBtnCls}
              >
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
            </div>
          )}
        </>
      )}
      {verified && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-positive text-sm font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Aadhaar Demo Verified — <span className="font-mono">{maskedDisplay}</span>
          </div>
          <button onClick={onNext} className={primaryBtnCls}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Personal Details ─────────────────────────────────────────────────

function StepPersonal({ onNext }: { onNext: (data: Record<string, string>) => void }) {
  const [form, setForm] = useState<Record<string, string>>({
    fullName: '', dob: '', gender: '', address: '', city: '',
    state: '', pinCode: '', occupation: '', annualIncome: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split('T')[0];

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.gender) e.gender = 'Please select gender';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Please select state';
    if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = 'Enter valid 6-digit PIN code';
    if (!form.occupation) e.occupation = 'Please select occupation';
    if (!form.annualIncome) e.annualIncome = 'Please select annual income';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext(form);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pytrade-navy">Personal Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
          placeholder="As per PAN card" className={inputCls} />
        {errors.fullName && <p className="text-negative text-sm mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input type="date" value={form.dob} max={today}
          onChange={(e) => set('dob', e.target.value)} className={inputCls} />
        {errors.dob && <p className="text-negative text-sm mt-1">{errors.dob}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <div className="flex gap-4">
          {['Male', 'Female', 'Other'].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="gender" value={g}
                checked={form.gender === g}
                onChange={() => set('gender', g)}
                className="accent-pytrade-blue"
              />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-negative text-sm mt-1">{errors.gender}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
          placeholder="Flat/House No., Street, Area" rows={3}
          className={cn(inputCls, 'resize-none')} />
        {errors.address && <p className="text-negative text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input value={form.city} onChange={(e) => set('city', e.target.value)}
            placeholder="City" className={inputCls} />
          {errors.city && <p className="text-negative text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
          <input value={form.pinCode}
            onChange={(e) => set('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit PIN" className={inputCls} maxLength={6} />
          {errors.pinCode && <p className="text-negative text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <select value={form.state} onChange={(e) => set('state', e.target.value)}
          className={inputCls}>
          <option value="">Select State</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="text-negative text-sm mt-1">{errors.state}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
        <select value={form.occupation} onChange={(e) => set('occupation', e.target.value)}
          className={inputCls}>
          <option value="">Select Occupation</option>
          {['Salaried', 'Self-Employed', 'Business', 'Student', 'Retired', 'Other'].map((o) =>
            <option key={o} value={o}>{o}</option>
          )}
        </select>
        {errors.occupation && <p className="text-negative text-sm mt-1">{errors.occupation}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
        <select value={form.annualIncome} onChange={(e) => set('annualIncome', e.target.value)}
          className={inputCls}>
          <option value="">Select Annual Income</option>
          {['Below 1L', '1-5L', '5-10L', '10-25L', '25L+'].map((i) =>
            <option key={i} value={i}>{i}</option>
          )}
        </select>
        {errors.annualIncome && <p className="text-negative text-sm mt-1">{errors.annualIncome}</p>}
      </div>

      <button onClick={handleNext} className={primaryBtnCls}>Continue →</button>
    </div>
  );
}

// ─── Step 4: Bank Account ─────────────────────────────────────────────────────

function StepBank({ onNext }: { onNext: () => void }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    bankName: '', holderName: '', accountNumber: '', confirmAccount: '', ifsc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.bankName) e.bankName = 'Please select a bank';
    if (form.holderName.trim().length < 2) e.holderName = 'Enter account holder name';
    if (!/^\d{9,18}$/.test(form.accountNumber)) e.accountNumber = 'Account number must be 9–18 digits';
    if (form.confirmAccount !== form.accountNumber) e.confirmAccount = 'Account numbers do not match';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) e.ifsc = 'Invalid IFSC. Example: HDFC0001234';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    const last4 = form.accountNumber.slice(-4);
    dispatch(addBank({
      id: Date.now().toString(),
      bankName: form.bankName,
      maskedAccount: 'XXXXXXXX' + last4,
      ifsc: form.ifsc,
      holderName: form.holderName,
      isPrimary: false,
    }));
    setVerified(true);
  };

  const maskedAccount = form.accountNumber.length >= 4
    ? 'XXXXXXXX' + form.accountNumber.slice(-4)
    : '';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pytrade-navy">Bank Account</h2>

      {verified ? (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-positive text-sm font-medium">
              <CheckCircle2 className="h-5 w-5" /> Bank Account Verified (Demo)
            </div>
            <p className="text-sm text-gray-600">{form.bankName}</p>
            <p className="font-mono text-sm text-pytrade-navy">{maskedAccount}</p>
          </div>
          <button onClick={onNext} className={primaryBtnCls}>Continue →</button>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <select value={form.bankName} onChange={(e) => set('bankName', e.target.value)}
              className={inputCls}>
              <option value="">Select Bank</option>
              {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.bankName && <p className="text-negative text-sm mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input value={form.holderName} onChange={(e) => set('holderName', e.target.value)}
              placeholder="As per bank records" className={inputCls} />
            {errors.holderName && <p className="text-negative text-sm mt-1">{errors.holderName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input type="password" value={form.accountNumber}
              onChange={(e) => set('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))}
              placeholder="9–18 digit account number" className={inputCls} />
            {errors.accountNumber && <p className="text-negative text-sm mt-1">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number</label>
            <input type="text" value={form.confirmAccount}
              onChange={(e) => set('confirmAccount', e.target.value.replace(/\D/g, '').slice(0, 18))}
              placeholder="Re-enter account number" className={inputCls} />
            {errors.confirmAccount && <p className="text-negative text-sm mt-1">{errors.confirmAccount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input value={form.ifsc}
              onChange={(e) => set('ifsc', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g. HDFC0001234" className={inputCls} />
            {errors.ifsc && <p className="text-negative text-sm mt-1">{errors.ifsc}</p>}
          </div>

          <button onClick={handleVerify} disabled={loading} className={primaryBtnCls}>
            {loading ? 'Verifying…' : 'Verify Bank'}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Step 5: Documents & eSign ────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  size: number;
}

function StepDocuments({ onComplete }: { onComplete: () => void }) {
  const [addressProof, setAddressProof] = useState<UploadedFile | null>(null);
  const [signature, setSignature] = useState<UploadedFile | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: UploadedFile | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB');
      return;
    }
    setError('');
    setter({ name: file.name, size: file.size });
    e.target.value = '';
  };

  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  const handleSubmit = async () => {
    if (!consent) { setError('Please provide consent for demo eSign'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onComplete();
  };

  const checklist = [
    { label: 'PAN Card', status: true, auto: true },
    { label: 'Aadhaar', status: true, auto: true },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pytrade-navy">Documents & eSign</h2>

      {/* Auto-verified items */}
      {checklist.map((item) => (
        <div key={item.label} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">{item.label}</span>
          <span className="flex items-center gap-1 text-positive text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" /> Verified
          </span>
        </div>
      ))}

      {/* Address Proof upload */}
      <div className="p-3 border border-gray-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Address Proof</span>
          {addressProof ? (
            <span className="flex items-center gap-1 text-positive text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Uploaded
            </span>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e, setAddressProof)}
              />
              <span className={cn(outlineBtnCls, 'text-xs px-3 py-1.5 flex items-center gap-1')}>
                <Upload className="h-3 w-3" /> Upload
              </span>
            </label>
          )}
        </div>
        {addressProof && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{addressProof.name} ({formatSize(addressProof.size)})</span>
            <button onClick={() => setAddressProof(null)}
              className="text-negative hover:text-red-700" aria-label="Remove file">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Signature upload */}
      <div className="p-3 border border-gray-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Signature</span>
          {signature ? (
            <span className="flex items-center gap-1 text-positive text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Uploaded
            </span>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, setSignature)}
              />
              <span className={cn(outlineBtnCls, 'text-xs px-3 py-1.5 flex items-center gap-1')}>
                <Upload className="h-3 w-3" /> Upload
              </span>
            </label>
          )}
        </div>
        {signature && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{signature.name} ({formatSize(signature.size)})</span>
            <button onClick={() => setSignature(null)}
              className="text-negative hover:text-red-700" aria-label="Remove signature">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-pytrade-blue"
        />
        I hereby provide consent for demo eSign verification
      </label>

      <p className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
        This is a simulated eSign. No real legal signature is created.
      </p>

      {error && <p className="text-negative text-sm mt-1">{error}</p>}

      <button onClick={handleSubmit} disabled={loading} className={primaryBtnCls}>
        {loading ? 'Submitting…' : 'Submit & eSign Demo'}
      </button>
    </div>
  );
}

// ─── KYC Complete ─────────────────────────────────────────────────────────────

function KYCComplete({ kycRef }: { kycRef: string }) {
  return (
    <div className="text-center space-y-4">
      <CheckCircle2 className="h-16 w-16 text-positive mx-auto" />
      <h2 className="text-2xl font-bold text-pytrade-navy">KYC Submitted!</h2>
      <p className="text-sm text-gray-500">
        Your demo KYC has been submitted successfully.
      </p>
      <div className="bg-green-50 rounded-xl p-4">
        <p className="text-sm text-gray-500">Reference Number</p>
        <p className="font-mono font-bold text-pytrade-navy">{kycRef}</p>
        <p className="text-xs text-positive mt-1">Status: Demo Verified</p>
      </div>
      <p className="text-xs text-gray-400">
        This is simulated KYC. Not a real SEBI/NSDL verification.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/dashboard">
          <button className={primaryBtnCls}>Go to Dashboard</button>
        </Link>
        <Link href="/bank-accounts">
          <button className={outlineBtnCls}>Manage Banks</button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main KYC Page ────────────────────────────────────────────────────────────

export default function KYCPage() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [kycRef, setKycRef] = useState('');

  useEffect(() => {
    setKycRef('KYC' + Math.random().toString(36).slice(2, 10).toUpperCase());
  }, []);

  const next = () => setStep((s) => s + 1);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 space-y-6">
        <StepProgress currentStep={completed ? 6 : step} />
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {completed ? (
            <KYCComplete kycRef={kycRef} />
          ) : (
            <>
              {step === 1 && <StepPAN onNext={next} />}
              {step === 2 && <StepAadhaar onNext={next} />}
              {step === 3 && <StepPersonal onNext={(_data) => next()} />}
              {step === 4 && <StepBank onNext={next} />}
              {step === 5 && <StepDocuments onComplete={() => setCompleted(true)} />}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
