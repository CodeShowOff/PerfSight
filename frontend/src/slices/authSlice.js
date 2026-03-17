import { createSlice } from '@reduxjs/toolkit';

const getUserInfoFromStorage = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
};

const initialState = {
  userInfo: getUserInfoFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
