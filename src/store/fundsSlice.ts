import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TransactionType = 'ADD_FUNDS' | 'WITHDRAWAL' | 'ORDER_DEBIT' | 'ORDER_CREDIT';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
  method?: string; // UPI, Net Banking, Card
  bankAccount?: string; // masked
  reference: string;
  note?: string;
}

interface FundsState {
  balance: number;
  transactions: Transaction[];
}

const initialState: FundsState = {
  balance: 50000,
  transactions: [
    {
      id: 'TXN001',
      type: 'ADD_FUNDS',
      amount: 50000,
      status: 'SUCCESS',
      timestamp: '2025-01-10T10:00:00Z',
      method: 'UPI',
      reference: 'REF001',
      note: 'Initial demo funds',
    },
    {
      id: 'TXN002',
      type: 'ORDER_DEBIT',
      amount: 14602.5,
      status: 'SUCCESS',
      timestamp: '2025-01-13T10:15:00Z',
      reference: 'ORD007',
      note: 'BUY 20 SBIN @ 808.3',
    },
    {
      id: 'TXN003',
      type: 'ADD_FUNDS',
      amount: 10000,
      status: 'SUCCESS',
      timestamp: '2025-01-12T14:00:00Z',
      method: 'Net Banking',
      reference: 'REF002',
      note: 'Added funds',
    },
  ],
};

const fundsSlice = createSlice({
  name: 'funds',
  initialState,
  reducers: {
    addFunds(
      state,
      action: PayloadAction<{ amount: number; method: string; reference: string }>
    ) {
      state.balance += action.payload.amount;
      state.transactions.unshift({
        id: 'TXN' + Date.now().toString().slice(-6),
        type: 'ADD_FUNDS',
        amount: action.payload.amount,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        method: action.payload.method,
        reference: action.payload.reference,
        note: `Added via ${action.payload.method}`,
      });
    },
    requestWithdrawal(
      state,
      action: PayloadAction<{ amount: number; bankAccount: string; reference: string }>
    ) {
      if (action.payload.amount > state.balance) return;
      state.balance -= action.payload.amount;
      state.transactions.unshift({
        id: 'TXN' + Date.now().toString().slice(-8),
        type: 'WITHDRAWAL',
        amount: action.payload.amount,
        status: 'PENDING',
        timestamp: new Date().toISOString(),
        bankAccount: action.payload.bankAccount,
        reference: action.payload.reference,
        note: `Withdrawal to ${action.payload.bankAccount}`,
      });
    },
  },
});

export const { addFunds, requestWithdrawal } = fundsSlice.actions;
export default fundsSlice.reducer;
