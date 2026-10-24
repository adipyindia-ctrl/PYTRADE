import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  active: boolean;
  createdAt: string;
}

interface PriceAlertState {
  alerts: PriceAlert[];
}

const priceAlertSlice = createSlice({
  name: 'priceAlerts',
  initialState: { alerts: [] } as PriceAlertState,
  reducers: {
    addAlert(state, action: PayloadAction<Omit<PriceAlert, 'id' | 'createdAt'>>) {
      state.alerts.push({
        ...action.payload,
        id: 'ALT' + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString(),
      });
    },
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    toggleAlert(state, action: PayloadAction<string>) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert) alert.active = !alert.active;
    },
  },
});

export const { addAlert, removeAlert, toggleAlert } = priceAlertSlice.actions;
export default priceAlertSlice.reducer;
