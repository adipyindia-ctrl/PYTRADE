'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { cancelOrder } from '@/store/ordersSlice';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { OrderStatus } from '@/types';

function StatusBadge({ status }: { status: OrderStatus }) {
  const s: Record<OrderStatus, string> = {
    OPEN: 'bg-blue-100 text-pytrade-blue',
    EXECUTED: 'bg-green-100 text-positive',
    CANCELLED: 'bg-gray-100 text-gray-500',
    PENDING: 'bg-yellow-100 text-yellow-700',
  };
  return <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s[status])}>{status}</span>;
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(s => s.orders.orders);
  const [tab, setTab] = useState<'open' | 'executed' | 'cancelled' | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = orders;
    if (tab === 'open') list = orders.filter(o => o.status === 'OPEN');
    else if (tab === 'executed') list = orders.filter(o => o.status === 'EXECUTED');
    else if (tab === 'cancelled') list = orders.filter(o => o.status === 'CANCELLED' || o.status === 'PENDING');
    if (search) list = list.filter(o => o.symbol.toLowerCase().includes(search.toLowerCase()) || o.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [orders, tab, search]);

  const handleCancel = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Cancel this demo order?')) {
      dispatch(cancelOrder(id));
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-pytrade-navy">Orders</h1>
            <p className="text-xs text-amber-600">Demo orders — not real brokerage records</p>
          </div>
          <Link href="/orders/new" className="bg-pytrade-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 inline-block text-center">
            + New Order
          </Link>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'open', 'executed', 'cancelled'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors',
                tab === t ? 'bg-pytrade-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
              {t === 'all' ? 'All Orders' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by symbol..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Time', 'Symbol', 'Side', 'Qty', 'Type', 'Price', 'Value', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
                )}
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(order.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/stocks/${order.symbol}`} className="font-semibold text-pytrade-navy hover:text-pytrade-blue">
                        {order.symbol}
                      </Link>
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">{order.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded', order.side === 'BUY' ? 'bg-green-100 text-positive' : 'bg-red-100 text-negative')}>
                        {order.side}
                      </span>
                    </td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 text-xs">{order.orderType}</td>
                    <td className="px-4 py-3">{formatINR(order.price)}</td>
                    <td className="px-4 py-3 font-medium">{formatINR(order.quantity * order.price)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/orders/${order.id}`} className="text-pytrade-blue text-xs font-medium hover:underline">View</Link>
                        {order.status === 'OPEN' && (
                          <button onClick={() => handleCancel(order.id)} className="text-negative text-xs font-medium hover:underline">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {filtered.length === 0 && <div className="text-center text-gray-400 py-8">No orders found</div>}
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/stocks/${order.symbol}`}>
                    <span className="font-bold text-pytrade-navy hover:text-pytrade-blue">{order.symbol}</span>
                  </Link>
                  <span className={cn('ml-2 text-xs font-bold px-1.5 py-0.5 rounded', order.side === 'BUY' ? 'bg-green-100 text-positive' : 'bg-red-100 text-negative')}>
                    {order.side}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{order.name}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">{order.quantity} × {formatINR(order.price)}</span>
                <span className="font-semibold text-pytrade-navy">{formatINR(order.quantity * order.price)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString('en-IN')}</p>
              <div className="mt-2 flex gap-3">
                <Link href={`/orders/${order.id}`} className="text-pytrade-blue text-xs font-medium">View Details</Link>
                {order.status === 'OPEN' && (
                  <button onClick={() => handleCancel(order.id)} className="text-negative text-xs font-medium">Cancel Order</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
