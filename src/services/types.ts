export interface TIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

export interface TOrder {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface TUser {
  email: string;
  name: string;
}

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
