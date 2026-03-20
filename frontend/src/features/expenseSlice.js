import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ExpenseSDK } from '../api/sdk';
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const response = await ExpenseSDK.getAll();
  return response.expenses;
});
export const addExpense = createAsyncThunk('expense/add', async (data) => {
  const response = await ExpenseSDK.create(data);
  return response;
});
export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, data }) => {
    const response = await ExpenseSDK.update(id, data);
    return response;
  }
);
export const deleteExpense = createAsyncThunk('expenses/delete', async (id) => {
  await ExpenseSDK.delete(id);
  return id;
});
const expenseSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;
