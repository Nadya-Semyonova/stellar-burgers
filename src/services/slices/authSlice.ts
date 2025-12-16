import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TAuthResponse } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Логин
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const data = await loginUserApi(credentials);

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('refreshToken', data.refreshToken);

    const accessToken = data.accessToken.replace('Bearer ', '');
    setCookie('accessToken', accessToken);
    return data;
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }) => {
    const data = await registerUserApi(userData);

    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('refreshToken', data.refreshToken);
    const accessToken = data.accessToken.replace('Bearer ', '');
    setCookie('accessToken', accessToken);
    return data;
  }
);

// Получение данных пользователя
export const getUser = createAsyncThunk('auth/getUser', async () => {
  try {
    const data = await getUserApi();

    if (!data.success) {
      throw new Error(data.message || 'Failed to get user');
    }

    return data;
  } catch (error) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    throw error;
  }
});

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { email: string; name: string; password?: string }) => {
    const data = await updateUserApi(userData);

    if (!data.success) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  }
);

// Выход
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    const data = await logoutApi();

    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');

    return data;
  } catch (error) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
