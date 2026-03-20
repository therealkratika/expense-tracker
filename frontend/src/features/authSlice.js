import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSDK } from '../api/sdk';

// 1. Lowercase naming to match your Signup.jsx imports
export const SignupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthSDK.signup(name, email, password);
      // Ensure we return the user data correctly
      return response.user || response;
    } catch (err) {
      // Use .message to ensure we pass a STRING, not an Error Object (prevents Error #31)
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
    // 2. Load from localStorage so name persists on Refresh
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user'); // Clear storage on logout
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* SIGNUP CASES */
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
        state.error = action.payload; // This is now a string thanks to rejectWithValue
      })

      /* LOGIN CASES */
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action.payload.user || action.payload;
        state.user = userData;
        state.error = null;
        // Save to storage
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
