import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistItem } from '@/types';
import { mockStocks } from '@/mocks/stocks';

const INITIAL_WATCHLIST_SYMBOLS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];

const initialItems: WatchlistItem[] = mockStocks
  .filter((s) => INITIAL_WATCHLIST_SYMBOLS.includes(s.symbol))
  .map((s) => ({ ...s, isWatched: true }));

interface WatchlistState {
  items: WatchlistItem[];
}

const initialState: WatchlistState = {
  items: initialItems,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist(state, action: PayloadAction<WatchlistItem>) {
      const exists = state.items.some((i) => i.symbol === action.payload.symbol);
      if (!exists) {
        state.items.push({ ...action.payload, isWatched: true });
      }
    },
    removeFromWatchlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.symbol !== action.payload);
    },
    toggleWatchlist(state, action: PayloadAction<WatchlistItem>) {
      const index = state.items.findIndex((i) => i.symbol === action.payload.symbol);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({ ...action.payload, isWatched: true });
      }
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
