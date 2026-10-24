import { mockOrders } from '@/mocks/orders';
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return mockOrders.map(o => ({ orderId: o.id }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderDetailClient orderId={orderId} />;
}
