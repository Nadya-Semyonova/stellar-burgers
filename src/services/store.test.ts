import { store } from '../services/store';

describe('rootReducer initialization', () => {
  test('store should be initialized with correct structure', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profileOrders');
  });

  test('auth should have correct initial state', () => {
    const state = store.getState().auth;

    expect(state).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  });

  test('order should have correct initial state', () => {
    const state = store.getState().order;

    expect(state).toEqual({
      currentOrder: null,
      orderNumber: null,
      loading: false,
      error: null
    });
  });

  test('feed should have correct initial state', () => {
    const state = store.getState().feed;

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });

  test('profileOrders should have correct initial state', () => {
    const state = store.getState().profileOrders;

    expect(state).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });
});
