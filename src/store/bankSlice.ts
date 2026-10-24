'use client';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LinkedBank {
  id: string;
  bankName: string;
  maskedAccount: string; // format: XXXXXXXX1234
  ifsc: string;
  holderName: string;
  isPrimary: boolean;
}

interface BankState {
  linkedBanks: LinkedBank[];
}

const initialState: BankState = { linkedBanks: [] };

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    addBank(state, action: PayloadAction<LinkedBank>) {
      if (state.linkedBanks.length >= 3) return;
      // if first bank, make primary
      if (state.linkedBanks.length === 0) action.payload.isPrimary = true;
      state.linkedBanks.push(action.payload);
    },
    removeBank(state, action: PayloadAction<string>) {
      const idx = state.linkedBanks.findIndex((b) => b.id === action.payload);
      if (idx === -1) return;
      const wasPrimary = state.linkedBanks[idx].isPrimary;
      state.linkedBanks.splice(idx, 1);
      if (wasPrimary && state.linkedBanks.length > 0) {
        state.linkedBanks[0].isPrimary = true;
      }
    },
    setPrimaryBank(state, action: PayloadAction<string>) {
      state.linkedBanks.forEach((b) => {
        b.isPrimary = b.id === action.payload;
      });
    },
  },
});

export const { addBank, removeBank, setPrimaryBank } = bankSlice.actions;
export default bankSlice.reducer;
