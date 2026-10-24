// SIMULATED DATA — FOR DEMO PURPOSES ONLY

export interface NewsItem {
  id: string;
  title: string;
  category: 'Market' | 'Economy' | 'Company' | 'IPO';
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
}

export const mockNews: NewsItem[] = [
  {
    id: 'news001',
    title: 'NIFTY 50 Extends Gains on Broad-Based Buying',
    category: 'Market',
    summary:
      'Indian equity benchmarks closed higher for the second consecutive session, driven by gains in banking and IT sectors. Positive global cues supported the rally.',
    source: 'Market Desk',
    publishedAt: '2025-01-15T13:30:00.000Z',
    url: '#',
  },
  {
    id: 'news002',
    title: 'RBI Holds Repo Rate Steady at 6.5%',
    category: 'Economy',
    summary:
      'The Reserve Bank of India kept the repo rate unchanged for the seventh straight meeting, maintaining its focus on inflation management while supporting growth.',
    source: 'Economy Desk',
    publishedAt: '2025-01-15T11:00:00.000Z',
    url: '#',
  },
  {
    id: 'news003',
    title: 'Reliance Industries Reports Strong Q3 Results',
    category: 'Company',
    summary:
      'Reliance Industries posted robust quarterly earnings, with retail and digital segments continuing to outperform expectations. Net profit rose year-on-year.',
    source: 'Corporate Desk',
    publishedAt: '2025-01-15T09:45:00.000Z',
    url: '#',
  },
  {
    id: 'news004',
    title: 'Upcoming IPO: SME Segment Sees Record Applications',
    category: 'IPO',
    summary:
      'The SME IPO segment witnessed record-level oversubscriptions this week, reflecting strong retail investor appetite for primary market opportunities.',
    source: 'IPO Tracker',
    publishedAt: '2025-01-14T16:00:00.000Z',
    url: '#',
  },
  {
    id: 'news005',
    title: 'IT Sector Outlook Positive on US Spending Recovery',
    category: 'Company',
    summary:
      'Analysts upgraded their outlook for Indian IT majors following signals of improved technology spending budgets from large US-based enterprises.',
    source: 'Sector Watch',
    publishedAt: '2025-01-14T14:20:00.000Z',
    url: '#',
  },
  {
    id: 'news006',
    title: 'Foreign Institutional Investors Turn Net Buyers',
    category: 'Market',
    summary:
      'FIIs turned net buyers in Indian equities after a prolonged selling streak, injecting confidence into the broader market. DIIs continued to support the market.',
    source: 'Market Desk',
    publishedAt: '2025-01-14T12:10:00.000Z',
    url: '#',
  },
  {
    id: 'news007',
    title: 'India GDP Growth Estimate Revised Upward',
    category: 'Economy',
    summary:
      'The government revised its GDP growth forecast upward for the current fiscal year, citing strong domestic consumption and infrastructure investment trends.',
    source: 'Economy Desk',
    publishedAt: '2025-01-13T10:30:00.000Z',
    url: '#',
  },
  {
    id: 'news008',
    title: 'HDFC Bank Eyes Expansion in Tier-2 Cities',
    category: 'Company',
    summary:
      'HDFC Bank announced plans to expand its branch and digital banking presence in smaller cities as part of its next phase of growth strategy.',
    source: 'Corporate Desk',
    publishedAt: '2025-01-13T08:50:00.000Z',
    url: '#',
  },
];
