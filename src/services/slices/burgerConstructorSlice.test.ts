import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '../types';

// Мокаем uuid
jest.mock('uuid', () => ({
  v4: jest
    .fn()
    .mockReturnValueOnce('uuid-1') // для первого ингредиента
    .mockReturnValueOnce('uuid-2') // для второго ингредиента
    .mockReturnValue('uuid-default') // для остальных случаев
}));

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun' as const,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image_url',
  image_mobile: 'image_mobile_url',
  image_large: 'image_large_url',
  __v: 0
};

const mockIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main' as const,
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'image_url',
  image_mobile: 'image_mobile_url',
  image_large: 'image_large_url',
  __v: 0
};

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    totalPrice: 0
  };

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun action', () => {
    test('should add bun and update total price', () => {
      const action = addBun(mockBun);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.totalPrice).toBe(mockBun.price * 2);
    });

    test('should replace existing bun', () => {
      const firstState = burgerConstructorReducer(
        initialState,
        addBun(mockBun)
      );

      const anotherBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Флюоресцентная булка R2-D3',
        price: 988
      };

      const state = burgerConstructorReducer(firstState, addBun(anotherBun));

      expect(state.bun).toEqual(anotherBun);
      expect(state.totalPrice).toBe(anotherBun.price * 2);
    });
  });

  describe('addIngredient action', () => {
    test('should add ingredient with unique id', () => {
      const action = addIngredient(mockIngredient);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
      expect(state.totalPrice).toBe(mockIngredient.price);
    });

    test('should add multiple ingredients and calculate total price correctly', () => {
      const sauceIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'sauce-1',
        type: 'sauce' as const,
        price: 300
      };

      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(sauceIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.totalPrice).toBe(
        mockIngredient.price + sauceIngredient.price
      );
    });

    test('should calculate total price with bun and ingredients', () => {
      const stateWithBun = burgerConstructorReducer(
        initialState,
        addBun(mockBun)
      );
      const stateWithAll = burgerConstructorReducer(
        stateWithBun,
        addIngredient(mockIngredient)
      );

      const expectedPrice = mockBun.price * 2 + mockIngredient.price;
      expect(stateWithAll.totalPrice).toBe(expectedPrice);
    });
  });

  describe('removeIngredient action', () => {
    test('should remove ingredient by id', () => {
      // Сначала добавляем ингредиент
      const addAction = addIngredient(mockIngredient);
      const stateWithIngredient = burgerConstructorReducer(
        initialState,
        addAction
      );

      const ingredientId = stateWithIngredient.ingredients[0].id;

      // Удаляем ингредиент
      const removeAction = removeIngredient(ingredientId);
      const stateAfterRemoval = burgerConstructorReducer(
        stateWithIngredient,
        removeAction
      );

      expect(stateAfterRemoval.ingredients).toHaveLength(0);
      expect(stateAfterRemoval.totalPrice).toBe(0);
    });

    test('should not remove ingredient if id does not exist', () => {
      const addAction = addIngredient(mockIngredient);
      const state = burgerConstructorReducer(initialState, addAction);

      const originalIngredients = [...state.ingredients];

      const removeAction = removeIngredient('non-existent-id');
      const newState = burgerConstructorReducer(state, removeAction);

      expect(newState.ingredients).toEqual(originalIngredients);
    });

    test('should update total price after removal', () => {
      // Настраиваем мок для uuid, чтобы возвращал разные id
      const { v4: uuidv4 } = require('uuid');
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('uuid-1') // для первого ингредиента
        .mockReturnValueOnce('uuid-2'); // для второго ингредиента

      // Создаем два разных ингредиента с разными _id
      const firstIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'main-1',
        price: 424
      };

      const secondIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'main-2',
        price: 200
      };

      // Добавляем булку
      const stateWithBun = burgerConstructorReducer(
        initialState,
        addBun(mockBun)
      );

      // Добавляем первый ингредиент
      const stateWithFirstIngredient = burgerConstructorReducer(
        stateWithBun,
        addIngredient(firstIngredient)
      );

      // Добавляем второй ингредиент
      const stateWithBothIngredients = burgerConstructorReducer(
        stateWithFirstIngredient,
        addIngredient(secondIngredient)
      );

      // Проверяем, что оба ингредиента добавлены с разными id
      expect(stateWithBothIngredients.ingredients).toHaveLength(2);
      expect(stateWithBothIngredients.ingredients[0].id).toBe('uuid-1');
      expect(stateWithBothIngredients.ingredients[1].id).toBe('uuid-2');

      // Сохраняем id первого ингредиента
      const firstIngredientId = stateWithBothIngredients.ingredients[0].id;
      const originalPrice = stateWithBothIngredients.totalPrice;

      // Удаляем первый ингредиент
      const stateAfterRemoval = burgerConstructorReducer(
        stateWithBothIngredients,
        removeIngredient(firstIngredientId)
      );

      // Проверяем, что остался только второй ингредиент
      expect(stateAfterRemoval.ingredients).toHaveLength(1);
      expect(stateAfterRemoval.ingredients[0].id).toBe('uuid-2');

      // Проверяем, что оставшийся ингредиент - это второй
      expect(stateAfterRemoval.ingredients[0]._id).toBe('main-2');
      expect(stateAfterRemoval.ingredients[0].price).toBe(200);

      // Рассчитываем ожидаемую цену: булка * 2 + второй ингредиент
      const expectedPrice = mockBun.price * 2 + secondIngredient.price;
      expect(stateAfterRemoval.totalPrice).toBe(expectedPrice);
    });
  });
  describe('moveIngredient action', () => {
    test('should change order of ingredients', () => {
      const { v4: uuidv4 } = require('uuid');
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2')
        .mockReturnValueOnce('uuid-3');

      // Создаем три разных ингредиента
      const ingredients = [
        { ...mockIngredient, _id: '1', name: 'Ингредиент 1' },
        { ...mockIngredient, _id: '2', name: 'Ингредиент 2' },
        { ...mockIngredient, _id: '3', name: 'Ингредиент 3' }
      ];

      // Добавляем ингредиенты по одному
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(ingredients[0])
      );
      state = burgerConstructorReducer(state, addIngredient(ingredients[1]));
      state = burgerConstructorReducer(state, addIngredient(ingredients[2]));

      // Проверяем исходный порядок
      expect(state.ingredients[0]._id).toBe('1');
      expect(state.ingredients[1]._id).toBe('2');
      expect(state.ingredients[2]._id).toBe('3');

      // Перемещаем первый элемент на позицию 2
      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const newState = burgerConstructorReducer(state, action);

      // Проверяем новый порядок
      expect(newState.ingredients[0]._id).toBe('2');
      expect(newState.ingredients[1]._id).toBe('3');
      expect(newState.ingredients[2]._id).toBe('1');

      // Проверяем, что общая цена не изменилась
      expect(newState.totalPrice).toBe(state.totalPrice);
    });

    test('should handle moving to the same position', () => {
      const { v4: uuidv4 } = require('uuid');
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2');

      const ingredients = [
        { ...mockIngredient, _id: '1' },
        { ...mockIngredient, _id: '2' }
      ];

      let state = burgerConstructorReducer(
        initialState,
        addIngredient(ingredients[0])
      );
      state = burgerConstructorReducer(state, addIngredient(ingredients[1]));

      const originalIngredients = [...state.ingredients];

      // Пытаемся переместить элемент на ту же позицию
      const action = moveIngredient({ fromIndex: 0, toIndex: 0 });
      const newState = burgerConstructorReducer(state, action);

      expect(newState.ingredients).toEqual(originalIngredients);
    });
  });
  describe('clearConstructor action', () => {
    test('should clear all ingredients and bun', () => {
      let state = burgerConstructorReducer(initialState, addBun(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      const action = clearConstructor();
      const clearedState = burgerConstructorReducer(state, action);

      expect(clearedState.bun).toBeNull();
      expect(clearedState.ingredients).toHaveLength(0);
      expect(clearedState.totalPrice).toBe(0);
    });

    test('should reset to initial state', () => {
      let state = burgerConstructorReducer(initialState, addBun(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      const action = clearConstructor();
      const clearedState = burgerConstructorReducer(state, action);

      expect(clearedState).toEqual(initialState);
    });
  });
});
