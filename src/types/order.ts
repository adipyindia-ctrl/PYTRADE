export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
export type OrderStatus = 'OPEN' | 'EXECUTED' | 'CANCELLED' | 'PENDING';

export interface Order {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  quantity: number;
  orderType: OrderType;
  price: number;
  status: OrderStatus;
  timestamp: string;
}
