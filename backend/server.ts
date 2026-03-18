import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import expenseRoutes from './src/routes/ExpenseRoutes';
import budgetRoutes from './src/routes/BudgetRouter';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'https://expense-tracker-1-e7lf.onrender.com',
    credentials: true,
  })
);
app.use(express.json());
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});