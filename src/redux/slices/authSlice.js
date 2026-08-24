import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('auth') || 'null');
    return saved || { user: null, isLoggedIn: false };
  } catch {
    return { user: null, isLoggedIn: false };
  }
};

const initialState = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = { email: action.payload.email };
      state.isLoggedIn = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.setItem('auth', JSON.stringify(state));
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
