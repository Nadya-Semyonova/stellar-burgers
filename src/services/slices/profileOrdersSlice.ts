import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../types';
import { getOrdersApi } from '../../utils/burger-api';

interface ProfileOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  async () => await getOrdersApi()
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrdersError: (state) => {
      state.error = null;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile orders';
      });
  }
});

export const { clearProfileOrdersError, clearProfileOrders } =
  profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
