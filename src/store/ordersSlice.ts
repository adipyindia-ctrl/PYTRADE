import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/mocks/orders';

interface OrdersState { orders: Order[]; }
const initialState: OrdersState = { orders: [...mockOrders] };

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder(state, action: PayloadAction<Omit<Order, 'timestamp' | 'status'>>) {
      const newOrder: Order = {
        ...action.payload,
        timestamp: new Date().toISOString(),
        status: 'OPEN',
      };
      state.orders.unshift(newOrder);
    },
    cancelOrder(state, action: PayloadAction<string>) {
      const order = state.orders.find(o => o.id === action.payload);
      if (order && order.status === 'OPEN') order.status = 'CANCELLED';
    },
  },
});

export const { placeOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
