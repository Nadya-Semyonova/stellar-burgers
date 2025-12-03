export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export interface TAuthResponse {
  message: string;
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

export interface TFeedResponse {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export interface TProfileOrdersResponse {
  success: boolean;
  orders: TOrder[];
}
