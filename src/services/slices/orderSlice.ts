import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../store';

interface OrderState {
  currentOrder: TOrder | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderNumber: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { getState }) => {
    const state = getState() as RootState;

    const { bun, ingredients: constructorIngredients } =
      state.burgerConstructor;

    if (!bun) {
      throw new Error('Выберите булку для заказа');
    }

    if (constructorIngredients.length === 0) {
      throw new Error('Добавьте начинку для заказа');
    }

    const data = await orderBurgerApi(ingredients);

    if (!data.success) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (orderNumber: number) => {
    const data = await getOrderByNumberApi(orderNumber);

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderNumber = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orderNumber = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
