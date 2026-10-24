'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStocks } from '@/mocks/stocks';
import { mockNews } from '@/mocks/news';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleWatchlist } from '@/store/watchlistSlice';
import { placeOrder } from '@/store/ordersSlice';
import { formatINR, formatPercent, formatVolume } from '@/lib/formatters';
import { generateStockChartData, RANGE_POINTS } from '@/lib/chartData';
import { cn } from '@/lib/utils';
import type { Stock, OrderSide } from '@/types';

export default function StockDetailClient({ stock }: { stock: Stock }) {
  const [range, setRange] = useState('1M');
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'news' | 'financials'>('overview');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [product, setProduct] = useState('Delivery');
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [limitPrice, setLimitPrice] = useState(stock.price);

  const positive = stock.changePercent >= 0;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const watchedSymbols = useAppSelector(s => s.watchlist.items.map(i => i.symbol));
  const isWatched = watchedSymbols.includes(stock.symbol);

  const chartData = useMemo(
    () => generateStockChartData(stock.price, stock.symbol, RANGE_POINTS[range] ?? 30),
    [stock.price, stock.symbol, range]
  );

  const related = mockStocks.filter(s => s.sector === stock.sector && s.symbol !== stock.symbol).slice(0, 3);

  const handlePlaceOrder = () => {
    const orderId = 'ORD' + Date.now().toString().slice(-6);
    dispatch(placeOrder({
      id: orderId,
      symbol: stock.symbol,
      name: stock.name,
      side,
      quantity: qty,
      orderType: orderType === 'Market' ? 'MARKET' : 'LIMIT',
      price: orderType === 'Market' ? stock.price : limitPrice,
    }));
    router.push(`/orders/${orderId}`);
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Stock header card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-pytrade-navy">{stock.symbol}</h1>
                <span className="text-xs bg-blue-50 text-pytrade-blue px-2 py-0.5 rounded-full">{stock.sector}</span>
              </div>
              <p className="text-sm text-gray-500">{stock.name}</p>
            </div>
            <button
              onClick={() => dispatch(toggleWatchlist({ ...stock, isWatched: true }))}
              className="p-2 hover:bg-gray-50 rounded-xl"
              aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isWatched ? <BookmarkCheck className="h-6 w-6 text-pytrade-blue" /> : <Bookmark className="h-6 w-6 text-gray-400" />}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-pytrade-navy">{formatINR(stock.price)}</span>
            <span className={cn('text-base font-semibold', positive ? 'text-positive' : 'text-negative')}>
              {positive ? '+' : ''}{stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
            <span>Open: {formatINR(stock.price * 0.998)}</span>
            <span>High: {formatINR(stock.price * 1.012)}</span>
            <span>Low: {formatINR(stock.price * 0.985)}</span>
            <span>Prev: {formatINR(stock.price - stock.change)}</span>
          </div>
          <p className="text-xs text-amber-600 mt-2">Demo data — not real market prices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: chart + tabs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Range selector */}
            <div className="flex gap-2 flex-wrap">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    range === r ? 'bg-pytrade-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200')}>
                  {r}
                </button>
              ))}
            </div>
            {/* Chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={positive ? '#16A34A' : '#DC2626'} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={positive ? '#16A34A' : '#DC2626'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} domain={['auto', 'auto']} width={55} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Price']} labelFormatter={l => `Date: ${l}`} />
                    <Area type="monotone" dataKey="value" stroke={positive ? '#16A34A' : '#DC2626'} strokeWidth={2} fill="url(#sg)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm">
              {(['overview', 'chart', 'news', 'financials'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={cn('flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors',
                    activeTab === t ? 'bg-pytrade-blue text-white' : 'text-gray-600 hover:bg-gray-50')}>
                  {t}
                </button>
              ))}
            </div>
            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Market Cap', value: stock.marketCap ? formatINR(stock.marketCap, true) : 'N/A' },
                  { label: '52W High', value: formatINR(stock.price * 1.28) },
                  { label: '52W Low', value: formatINR(stock.price * 0.72) },
                  { label: 'Volume', value: formatVolume(stock.volume) },
                  { label: 'P/E Ratio', value: '22.4 (demo)' },
                  { label: 'EPS', value: formatINR(stock.price / 22.4) },
                ].map(stat => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-sm font-semibold text-pytrade-navy">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'news' && (
              <div className="space-y-3">
                {mockNews.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <span className="text-xs bg-blue-50 text-pytrade-blue px-2 py-0.5 rounded-full">{item.category}</span>
                    <h4 className="font-semibold text-pytrade-navy mt-2 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.summary}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(item.publishedAt).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'financials' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm overflow-x-auto">
                <p className="text-xs text-amber-600 mb-3">Demo financial data — not real figures</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs text-gray-500">Quarter</th>
                      <th className="text-right py-2 text-xs text-gray-500">Revenue (Cr)</th>
                      <th className="text-right py-2 text-xs text-gray-500">Net Profit (Cr)</th>
                      <th className="text-right py-2 text-xs text-gray-500">EPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { q: 'Q3 FY25', rev: '45,230', profit: '8,940', eps: '12.4' },
                      { q: 'Q2 FY25', rev: '43,180', profit: '8,210', eps: '11.9' },
                      { q: 'Q1 FY25', rev: '41,560', profit: '7,890', eps: '11.2' },
                      { q: 'Q4 FY24', rev: '40,120', profit: '7,340', eps: '10.8' },
                    ].map(row => (
                      <tr key={row.q} className="border-b last:border-0">
                        <td className="py-2 font-medium">{row.q}</td>
                        <td className="py-2 text-right">{row.rev}</td>
                        <td className="py-2 text-right text-positive">{row.profit}</td>
                        <td className="py-2 text-right">{row.eps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'chart' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={positive ? '#16A34A' : '#DC2626'} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={positive ? '#16A34A' : '#DC2626'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} domain={['auto', 'auto']} width={55} />
                      <Tooltip formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Price']} />
                      <Area type="monotone" dataKey="value" stroke={positive ? '#16A34A' : '#DC2626'} strokeWidth={2} fill="url(#sg2)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right: buy/sell + stats + related */}
          <div className="space-y-4">
            {/* Buy/Sell Panel */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setSide('BUY')}
                  className={cn('flex-1 py-2.5 rounded-xl font-semibold transition-colors text-sm', side === 'BUY' ? 'bg-positive text-white' : 'bg-gray-100 text-gray-600')}>
                  Buy
                </button>
                <button onClick={() => setSide('SELL')}
                  className={cn('flex-1 py-2.5 rounded-xl font-semibold transition-colors text-sm', side === 'SELL' ? 'bg-negative text-white' : 'bg-gray-100 text-gray-600')}>
                  Sell
                </button>
              </div>
              <div className="flex gap-1 text-xs">
                {['Delivery', 'Intraday', 'F&O'].map(p => (
                  <button key={p} onClick={() => setProduct(p)}
                    className={cn('px-3 py-1.5 rounded-lg font-medium flex-1 text-center', product === p ? 'bg-blue-50 text-pytrade-blue' : 'text-gray-500 hover:bg-gray-50')}>
                    {p}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                <input type="number" min={1} value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Order Type</label>
                <select value={orderType} onChange={e => setOrderType(e.target.value as 'Market' | 'Limit')}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none">
                  <option>Market</option>
                  <option>Limit</option>
                </select>
              </div>
              {orderType === 'Limit' && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Limit Price (₹)</label>
                  <input type="number" step={0.05} value={limitPrice}
                    onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Value</span>
                  <span className="font-semibold">{formatINR(qty * (orderType === 'Limit' ? limitPrice : stock.price))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Demo Balance</span>
                  <span className="text-positive font-medium">₹50,000</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder}
                className={cn('w-full py-3 rounded-xl font-semibold text-white text-sm transition-colors',
                  side === 'BUY' ? 'bg-positive hover:bg-green-700' : 'bg-negative hover:bg-red-700')}>
                Place {side === 'BUY' ? 'Buy' : 'Sell'} Order
              </button>
              <p className="text-xs text-center text-gray-400">Demo only — no real trade placed</p>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-pytrade-navy mb-3">Key Statistics</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Market Cap', value: stock.marketCap ? formatINR(stock.marketCap, true) : 'N/A' },
                  { label: '52W High', value: formatINR(stock.price * 1.28) },
                  { label: '52W Low', value: formatINR(stock.price * 0.72) },
                  { label: 'Volume', value: formatVolume(stock.volume) },
                ].map(s => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="font-medium text-pytrade-navy">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related stocks */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-pytrade-navy mb-3">Related Stocks</h3>
                <div className="space-y-2">
                  {related.map(s => (
                    <Link key={s.symbol} href={`/stocks/${s.symbol}`}
                      className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-pytrade-navy">{s.symbol}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{s.name}</p>
                      </div>
                      <span className={cn('text-xs font-semibold', s.changePercent >= 0 ? 'text-positive' : 'text-negative')}>
                        {formatPercent(s.changePercent)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
