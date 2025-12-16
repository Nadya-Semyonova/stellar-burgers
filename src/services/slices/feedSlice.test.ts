import feedReducer, {
  fetchFeedOrders,
  clearFeedError,
  initialState
} from './feedSlice';
import { TOrder } from '../types';

// Мокаем API функцию
jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    ingredients: ['ingredient-1', 'ingredient-2'],
    status: 'done',
    name: 'Order 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1
  },
  {
    _id: 'order-2',
    ingredients: ['ingredient-3', 'ingredient-4'],
    status: 'pending',
    name: 'Order 2',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 2
  }
];

const mockFeedResponse = {
  success: true,
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feed reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearFeedError action', () => {
    test('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const state = feedReducer(stateWithError, clearFeedError());

      expect(state.error).toBeNull();
    });
  });

  describe('fetchFeedOrders thunk actions', () => {
    test('should handle fetchFeedOrders.pending', () => {
      const action = { type: fetchFeedOrders.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    test('should handle fetchFeedOrders.fulfilled', () => {
      const action = {
        type: fetchFeedOrders.fulfilled.type,
        payload: mockFeedResponse
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = feedReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });

    test('should handle fetchFeedOrders.rejected', () => {
      const errorMessage = 'Failed to fetch feed orders';
      const action = {
        type: fetchFeedOrders.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = feedReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    test('should preserve existing orders when new request starts', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrders,
        total: 100,
        totalToday: 10
      };

      const action = { type: fetchFeedOrders.pending.type };
      const state = feedReducer(stateWithOrders, action);

      expect(state.loading).toBe(true);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });
});
