// SIMULATED IPO DATA — NOT REAL IPO LISTINGS
export type IPOStatus = 'UPCOMING' | 'OPEN' | 'CLOSED' | 'LISTED';

export interface IPOItem {
  id: string;
  company: string;
  initials: string; // 2 letter abbreviation for avatar
  sector: string;
  priceBand: { min: number; max: number };
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  status: IPOStatus;
  subscriptionTimes?: number; // times oversubscribed (demo)
  issueSize: string; // e.g. '₹450 Cr'
  description: string;
}

export const mockIPOs: IPOItem[] = [
  {
    id: 'ipo001',
    company: 'Tata Digital Services Ltd',
    initials: 'TD',
    sector: 'Technology',
    priceBand: { min: 280, max: 295 },
    lotSize: 50,
    openDate: '2025-01-20',
    closeDate: '2025-01-22',
    listingDate: '2025-01-28',
    status: 'OPEN',
    subscriptionTimes: 3.2,
    issueSize: '₹1,200 Cr',
    description: 'Leading digital services company offering cloud, AI, and enterprise solutions across India.',
  },
  {
    id: 'ipo002',
    company: 'GreenEnergy Corp Ltd',
    initials: 'GE',
    sector: 'Renewable Energy',
    priceBand: { min: 145, max: 155 },
    lotSize: 96,
    openDate: '2025-01-25',
    closeDate: '2025-01-27',
    listingDate: '2025-02-03',
    status: 'UPCOMING',
    issueSize: '₹680 Cr',
    description: 'Renewable energy company focusing on solar and wind power projects across India.',
  },
  {
    id: 'ipo003',
    company: 'MediCare Health Systems',
    initials: 'MH',
    sector: 'Healthcare',
    priceBand: { min: 420, max: 440 },
    lotSize: 34,
    openDate: '2025-01-10',
    closeDate: '2025-01-12',
    listingDate: '2025-01-18',
    status: 'LISTED',
    subscriptionTimes: 8.7,
    issueSize: '₹2,100 Cr',
    description: 'Multi-specialty hospital chain with presence across 12 states in India.',
  },
  {
    id: 'ipo004',
    company: 'FinPay Technologies Ltd',
    initials: 'FP',
    sector: 'Fintech',
    priceBand: { min: 190, max: 200 },
    lotSize: 75,
    openDate: '2025-02-01',
    closeDate: '2025-02-03',
    listingDate: '2025-02-10',
    status: 'UPCOMING',
    issueSize: '₹520 Cr',
    description: 'Digital payments and lending platform serving 5 million retail customers.',
  },
  {
    id: 'ipo005',
    company: 'AgroTech Innovations',
    initials: 'AT',
    sector: 'Agriculture',
    priceBand: { min: 95, max: 102 },
    lotSize: 146,
    openDate: '2025-01-05',
    closeDate: '2025-01-07',
    listingDate: '2025-01-13',
    status: 'CLOSED',
    subscriptionTimes: 2.1,
    issueSize: '₹340 Cr',
    description: 'Agricultural technology company providing precision farming solutions to Indian farmers.',
  },
  {
    id: 'ipo006',
    company: 'EduPath Learning Ltd',
    initials: 'EP',
    sector: 'EdTech',
    priceBand: { min: 310, max: 325 },
    lotSize: 46,
    openDate: '2025-02-08',
    closeDate: '2025-02-10',
    listingDate: '2025-02-17',
    status: 'UPCOMING',
    issueSize: '₹890 Cr',
    description: 'Online education platform with 2 million registered learners across K-12 and professional courses.',
  },
];
