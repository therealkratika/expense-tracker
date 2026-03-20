import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import expenseReducer from '../features/expenseSlice';
import budgetReducer from '../features/budgetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    budget: budgetReducer,
  }
});
export default store;
