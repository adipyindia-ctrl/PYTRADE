'use client';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppSelector } from '@/store';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types';

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const order = useAppSelector(s => s.orders.orders.find(o => o.id === orderId));

  if (!order) {
    return (
      <AppLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-4xl mb-4">📋</p>
          <h2 className="text-xl font-bold text-pytrade-navy">Order not found</h2>
          <p className="text-gray-500 mt-2">Order #{orderId} does not exist in this demo session.</p>
          <Link href="/orders" className="mt-4 inline-block bg-pytrade-blue text-white px-6 py-3 rounded-xl font-semibold">
            View All Orders
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isSuccess = order.status === 'OPEN' || order.status === 'EXECUTED';
  const statusColors: Record<OrderStatus, string> = {
    OPEN: 'bg-blue-100 text-pytrade-blue',
    EXECUTED: 'bg-green-100 text-positive',
    CANCELLED: 'bg-gray-100 text-gray-500',
    PENDING: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto p-4 lg:p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-4">
          {isSuccess
            ? <CheckCircle2 className="h-16 w-16 text-positive mx-auto" />
            : <XCircle className="h-16 w-16 text-negative mx-auto" />}
          <h2 className="text-xl font-bold text-pytrade-navy">Demo Order Placed Successfully</h2>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Stock</span><span className="font-medium">{order.symbol}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Company</span><span className="font-medium text-xs">{order.name}</span></div>
            <div className="flex justify-between">
              <span className="text-gray-500">Side</span>
              <span className={cn('font-bold', order.side === 'BUY' ? 'text-positive' : 'text-negative')}>{order.side}</span>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium">{order.quantity} shares</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Order Type</span><span className="font-medium">{order.orderType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-medium">{formatINR(order.price)}</span></div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Value</span>
              <span className="font-bold text-pytrade-navy">{formatINR(order.quantity * order.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', statusColors[order.status])}>{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="text-xs font-medium">{new Date(order.timestamp).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
            This is a demo order. No real trade was executed on any exchange.
          </p>
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1 border-2 border-gray-200 rounded-xl py-3 font-semibold text-center text-sm hover:bg-gray-50">
              View All Orders
            </Link>
            <Link href="/orders/new" className="flex-1 bg-pytrade-blue text-white rounded-xl py-3 font-semibold text-center text-sm hover:bg-blue-700">
              New Order
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
