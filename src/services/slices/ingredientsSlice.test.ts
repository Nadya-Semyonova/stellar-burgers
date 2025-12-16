import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../types';
import { initialState } from './ingredientsSlice';

describe('ingredients reducer', () => {
  test('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients thunk actions', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'image_url',
        image_mobile: 'image_mobile_url',
        image_large: 'image_large_url',
        __v: 0
      },
      {
        _id: '2',
        name: 'Соус',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 100,
        price: 300,
        image: 'image_url',
        image_mobile: 'image_mobile_url',
        image_large: 'image_large_url',
        __v: 0
      }
    ];

    test('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });

    test('should handle fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    test('should handle fetchIngredients.rejected', () => {
      const errorMessage = 'Network Error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      // Начинаем с состояния loading: true
      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = ingredientsReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    test('should clear error when starting new request', () => {
      // Начинаем с состояния с ошибкой
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should preserve items when request fails', () => {
      const stateWithItems = {
        items: mockIngredients,
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Error' }
      };

      const state = ingredientsReducer(stateWithItems, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error');
      expect(state.items).toEqual(mockIngredients);
    });

    test('should replace items when new request succeeds', () => {
      const oldItems = [mockIngredients[0]];
      const stateWithOldItems = {
        items: oldItems,
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = ingredientsReducer(stateWithOldItems, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).not.toEqual(oldItems);
    });
  });
});
