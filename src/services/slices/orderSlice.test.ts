import orderReducer, {
  createOrder,
  getOrderByNumber,
  clearOrder,
  initialState
} from './orderSlice';
import { TOrder } from '../types';

// Мокаем API функции
jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

jest.mock('../store', () => ({
  RootState: {}
}));

const mockOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done',
  name: 'Test Burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

const mockOrderResponse = {
  success: true,
  name: 'Test Burger',
  order: mockOrder
};

const mockOrderByNumberResponse = {
  success: true,
  orders: [mockOrder]
};

describe('order reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearOrder action', () => {
    test('should clear order state', () => {
      const stateWithOrder = {
        currentOrder: mockOrder,
        orderNumber: 12345,
        loading: false,
        error: 'Some error'
      };

      const state = orderReducer(stateWithOrder, clearOrder());

      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('createOrder thunk actions', () => {
    test('should handle createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });

    test('should handle createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = orderReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.orderNumber).toBe(12345);
      expect(state.error).toBeNull();
    });

    test('should handle createOrder.rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = orderReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });
  });

  describe('getOrderByNumber thunk actions', () => {
    test('should handle getOrderByNumber.pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle getOrderByNumber.fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = orderReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('should handle getOrderByNumber.rejected', () => {
      const errorMessage = 'Order not found';
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = orderReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
    });
  });
});
