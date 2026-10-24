import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IPOApplication {
  ipoId: string;
  company: string;
  lots: number;
  pricePerShare: number;
  totalAmount: number;
  appliedAt: string;
  refId: string;
  status: 'APPLIED' | 'ALLOTTED' | 'NOT_ALLOTTED';
}

interface IPOState {
  applications: IPOApplication[];
}

const ipoSlice = createSlice({
  name: 'ipo',
  initialState: { applications: [] } as IPOState,
  reducers: {
    applyIPO(
      state,
      action: PayloadAction<Omit<IPOApplication, 'appliedAt' | 'refId' | 'status'>>
    ) {
      state.applications.push({
        ...action.payload,
        appliedAt: new Date().toISOString(),
        refId: 'IPO' + Date.now().toString().slice(-8),
        status: 'APPLIED',
      });
    },
  },
});

export const { applyIPO } = ipoSlice.actions;
export default ipoSlice.reducer;
