import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { request } from '../api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
);

const slice = createSlice({
  name: 'auth',
  initialState: {
    admin: false,
    LoggedIn: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    signIn: (state, action) => {
      const user = action.payload || null;

      state.LoggedIn = true;
      state.user = user;
      state.admin = user?.role === 'admin';
      state.error = null;
    },
    signOut: (state) => {
      state.LoggedIn = false;
      state.admin = false;
      state.user = null;
      state.error = null;
    },
    createUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = action.payload.user;

        state.loading = false;
        state.LoggedIn = true;
        state.user = user;
        state.admin = user?.role === 'admin';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.LoggedIn = false;
        state.user = null;
        state.admin = false;
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
export const { signIn, signOut, createUser } = slice.actions;
