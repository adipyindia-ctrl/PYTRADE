'use client';

import { useState } from 'react';
import { DashboardCard, Badge } from '@/components/ui';
import { mockOrders } from '@/mocks/orders';
import { formatINR, formatDate, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

type Tab = 'open' | 'executed';

function statusVariant(
  status: OrderStatus
): 'success' | 'danger' | 'warning' | 'neutral' | 'info' {
  switch (status) {
    case 'EXECUTED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'OPEN':
      return 'info';
    case 'PENDING':
      return 'warning';
    default:
      return 'neutral';
  }
}

function isOpenTab(order: Order): boolean {
  return order.status === 'OPEN' || order.status === 'PENDING';
}

function isExecutedTab(order: Order): boolean {
  return order.status === 'EXECUTED' || order.status === 'CANCELLED';
}

interface OrderCardMobileProps {
  order: Order;
}

function OrderCardMobile({ order }: OrderCardMobileProps) {
  const isBuy = order.side === 'BUY';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span
        className={cn(
          'mt-0.5 px-2 py-0.5 rounded text-xs font-bold shrink-0',
          isBuy ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
        )}
      >
        {order.side}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-pytrade-navy">{order.symbol}</p>
        <p className="text-xs text-gray-400 truncate">{order.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {order.quantity} × {formatINR(order.price)} · {order.orderType}
        </p>
      </div>
      <div className="text-right shrink-0">
        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(order.timestamp)}
          <br />
          {formatTime(order.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function RecentOrders() {
  const [tab, setTab] = useState<Tab>('open');

  const displayOrders = mockOrders.filter(
    tab === 'open' ? isOpenTab : isExecutedTab
  );

  return (
    <DashboardCard title="Recent Orders">
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {(
          [
            { id: 'open' as Tab, label: 'Open / Pending' },
            { id: 'executed' as Tab, label: 'Executed / Cancelled' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              t.id === tab
                ? 'bg-pytrade-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-6">No orders in this category.</p>
      )}

      {/* Desktop table */}
      {displayOrders.length > 0 && (
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${tab} orders table`}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Symbol
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Side
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Qty
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Price
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((order) => {
                const isBuy = order.side === 'BUY';
                return (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-pytrade-navy">{order.symbol}</p>
                      <p className="text-xs text-gray-400 max-w-[120px] truncate">{order.name}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-bold',
                          isBuy ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        )}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{order.orderType}</td>
                    <td className="px-3 py-2.5 text-right text-pytrade-navy font-medium">
                      {order.quantity}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-pytrade-navy">
                      {formatINR(order.price)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right text-xs text-gray-400">
                      {formatDate(order.timestamp)}
                      <br />
                      {formatTime(order.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {displayOrders.length > 0 && (
        <div className="sm:hidden">
          {displayOrders.map((order) => (
            <OrderCardMobile key={order.id} order={order} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export default RecentOrders;
