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

  test('burgerConstructor should have correct initial state', () => {
    const state = store.getState().burgerConstructor;

    expect(state).toEqual({
      bun: null,
      ingredients: [],
      totalPrice: 0
    });
  });

  test('ingredients should have correct initial state', () => {
    const state = store.getState().ingredients;

    expect(state).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });
});
