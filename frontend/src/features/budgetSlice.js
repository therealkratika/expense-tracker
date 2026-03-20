import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetSDK } from '../api/sdk';

export const fetchBudget = createAsyncThunk('budget/fetch', async () => {
  const response = await BudgetSDK.getBudget();
  return response?.amount || 0;
});

export const updateBudgetLimit = createAsyncThunk(
  'budget/update',
  async (amount) => {
    const response = await BudgetSDK.updateBudget(amount);
    return response.amount;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState: { amount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.amount = action.payload;
      })
      .addCase(updateBudgetLimit.fulfilled, (state, action) => {
        state.amount = action.payload;
      });
  },
});

export default budgetSlice.reducer;
