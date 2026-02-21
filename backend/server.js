import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import expenseRoutes from './src/routes/ExpenseRoutes.js';
import budgetRoutes from './src/routes/BudgetRouter.js';
dotenv.config();
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);
app.listen(process.env.PORT || 5000);
