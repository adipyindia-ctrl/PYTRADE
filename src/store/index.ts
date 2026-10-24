import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import watchlistReducer from './watchlistSlice';
import bankReducer from './bankSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    bank: bankReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);
