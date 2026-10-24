import { mockStocks } from '@/mocks/stocks';
import StockDetailClient from './StockDetailClient';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';

export function generateStaticParams() {
  return mockStocks.map(s => ({ symbol: s.symbol }));
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const stock = mockStocks.find(s => s.symbol === symbol.toUpperCase());
  if (!stock) {
    return (
      <AppLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-pytrade-navy">Stock not found</h2>
          <p className="text-gray-500 mt-2">No demo data for &ldquo;{symbol}&rdquo;</p>
          <Link href="/markets" className="mt-4 inline-block bg-pytrade-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">Browse Markets</Link>
        </div>
      </AppLayout>
    );
  }
  return <StockDetailClient stock={stock} />;
}
