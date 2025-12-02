import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeedOrders = createAsyncThunk(
  'feed/fetchFeedOrders',
  async () => {
    const response = await fetch(`${process.env.BURGER_API_URL}/orders/all`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch feed orders');
    }

    return data;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feed orders';
      });
  }
});

export const { clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
