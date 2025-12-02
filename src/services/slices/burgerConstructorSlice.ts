import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorIngredient extends TIngredient {
  id: string;
}

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: ConstructorIngredient[];
  totalPrice: number;
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  totalPrice: 0
};

const calculateTotalPrice = (
  bun: TIngredient | null,
  ingredients: ConstructorIngredient[]
) => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, item) => sum + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
        state.ingredients.push(action.payload);
        state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.totalPrice = 0;
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
