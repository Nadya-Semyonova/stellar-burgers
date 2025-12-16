import profileOrdersReducer, {
  fetchProfileOrders,
  clearProfileOrdersError,
  clearProfileOrders,
  initialState
} from './profileOrdersSlice';
import { TOrder } from '../types';

// Мокаем API функцию
jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

const mockProfileOrders: TOrder[] = [
  {
    _id: 'profile-order-1',
    ingredients: ['ingredient-1', 'ingredient-2'],
    status: 'done',
    name: 'Profile Order 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1001
  },
  {
    _id: 'profile-order-2',
    ingredients: ['ingredient-3', 'ingredient-4'],
    status: 'pending',
    name: 'Profile Order 2',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1002
  }
];

describe('profileOrders reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(profileOrdersReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('clearProfileOrdersError action', () => {
    test('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const state = profileOrdersReducer(
        stateWithError,
        clearProfileOrdersError()
      );

      expect(state.error).toBeNull();
    });
  });

  describe('clearProfileOrders action', () => {
    test('should clear orders', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockProfileOrders
      };

      const state = profileOrdersReducer(stateWithOrders, clearProfileOrders());

      expect(state.orders).toEqual([]);
    });
  });

  describe('fetchProfileOrders thunk actions', () => {
    test('should handle fetchProfileOrders.pending', () => {
      const action = { type: fetchProfileOrders.pending.type };
      const state = profileOrdersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
    });

    test('should handle fetchProfileOrders.fulfilled', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockProfileOrders
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = profileOrdersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockProfileOrders);
      expect(state.error).toBeNull();
    });

    test('should handle fetchProfileOrders.rejected', () => {
      const errorMessage = 'Failed to fetch profile orders';
      const action = {
        type: fetchProfileOrders.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = profileOrdersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    test('should replace existing orders when new request succeeds', () => {
      const oldOrders = [mockProfileOrders[0]];
      const stateWithOldOrders = {
        ...initialState,
        orders: oldOrders,
        loading: true
      };

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockProfileOrders
      };

      const state = profileOrdersReducer(stateWithOldOrders, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockProfileOrders);
      expect(state.orders).not.toEqual(oldOrders);
    });
  });
});
