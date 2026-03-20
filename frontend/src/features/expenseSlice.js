import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ExpenseSDK } from '../api/sdk';

// ✅ FETCH (SAFE)
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const response = await ExpenseSDK.getAll();

  console.log('FETCH RESPONSE:', response); // debug

  // ✅ ALWAYS RETURN ARRAY
  if (Array.isArray(response)) return response;
  if (response?.data) return response.data;
  if (response?.expenses) return response.expenses;

  return [];
});

// ✅ ADD
export const addExpense = createAsyncThunk('expenses/add', async (data) => {
  const response = await ExpenseSDK.create(data);
  return response;
});

// ✅ UPDATE
export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, data }) => {
    const response = await ExpenseSDK.update(id, data);
    return response;
  }
);

// ✅ DELETE
export const deleteExpense = createAsyncThunk('expenses/delete', async (id) => {
  await ExpenseSDK.delete(id);
  return id;
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
