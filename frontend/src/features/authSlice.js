import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSDK } from '../api/sdk';
export const SignupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthSDK.signup(name, email, password);
      return response.user;
    } catch (err) {
      return rejectWithValue(err.message || 'Signup failed');
    }
  }
);
export const LoginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthSDK.login(email, password);
      return response.user;
    } catch (err) {
      return rejectWithValue(err.message || 'Invalid email or password');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
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
      })
      .addCase(SignupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Inside authSlice.js
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure action.payload is the user object {name, email}, NOT the whole response
        state.user = action.payload.user || action.payload;
        state.error = null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null; // IMPORTANT: Reset user to null on error
        state.error = action.payload; // Store the error string here, NOT in state.user
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
