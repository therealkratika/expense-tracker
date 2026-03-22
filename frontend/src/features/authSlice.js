import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSDK } from '../api/sdk';
export const SignupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthSDK.signup(name, email, password);
      return response.user || response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Signup failed'
      );
    }
  }
);

export const LoginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthSDK.login(email, password);
      return response.user || response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          'Invalid email or password'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SignupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(SignupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action.payload.user || action.payload;
        state.user = userData;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
