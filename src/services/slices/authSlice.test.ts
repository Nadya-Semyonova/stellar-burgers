import authReducer, {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
  clearError,
  initialState
} from './authSlice';
import { TUser } from '../types';

// Мокаем API функции
jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

// Мокаем cookie функции
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Мокаем localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse = {
  success: true,
  accessToken: 'Bearer test-access-token',
  refreshToken: 'test-refresh-token',
  user: mockUser,
  message: ''
};

describe('auth reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  test('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearError action', () => {
    test('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });
  });

  describe('loginUser thunk actions', () => {
    test('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    test('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle loginUser.rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = authReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser thunk actions', () => {
    test('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    test('should handle registerUser.rejected', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = {
        ...initialState,
        loading: true
      };

      const state = authReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUser thunk actions', () => {
    test('should handle getUser.fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    test('should handle getUser.rejected', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Unauthorized' }
      };

      const authenticatedState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };

      const state = authReducer(authenticatedState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser thunk actions', () => {
    const updatedUser: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    const updatedAuthResponse = {
      ...mockAuthResponse,
      user: updatedUser
    };

    test('should handle updateUser.fulfilled', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedAuthResponse
      };

      const stateWithUser = {
        ...initialState,
        user: mockUser
      };

      const state = authReducer(stateWithUser, action);

      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('logoutUser thunk actions', () => {
    test('should handle logoutUser.fulfilled', () => {
      const action = {
        type: logoutUser.fulfilled.type,
        payload: { success: true, message: '' }
      };

      const authenticatedState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };

      const state = authReducer(authenticatedState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    test('should handle logoutUser.rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Logout failed' }
      };

      const authenticatedState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };

      const state = authReducer(authenticatedState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
